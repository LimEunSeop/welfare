import { db } from '../../db'
import config from '../../../auth.config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createToken, verifyExpiration } from '../utils/token'
import { writeLog } from '../utils'

async function signup(req, res) {
  try {
    // Save db.user to Database
    const { email, password, name, phone, orgName } = req.body
    const user = await db.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 8),
        name,
        phone,
      },
    })

    // 권한을 명시한 경우 아마 관리자가 수동으로 중간관리자를 생성할 경우일 것임. org 생성하지 말고 그대로 둘것
    if (req.body.roles) {
      const roles = await db.role.findMany({
        where: {
          OR: req.body.roles.map((role) => ({
            name: {
              equals: role,
            },
          })),
        },
      })

      await db.user.update({
        where: { id: user.id },
        data: {
          roles: {
            set: roles.map((role) => ({
              id: role.id,
            })),
          },
        },
      })
    } else {
      // 이건 일반적으로 회원가입을 한 경우를 뜻함
      // user role = 3
      await db.user.update({
        where: { id: user.id },
        data: {
          roles: {
            set: [{ name: 'user' }],
          },
          userDetail: {
            create: {
              bossInfo: {
                create: {
                  orgs: {
                    create: { name: orgName },
                  },
                },
              },
            },
          },
        },
      })
    }

    writeLog('SIGN_UP', user)

    res.send({ message: '회원가입이 완료되었습니다!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

async function signin(req, res) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        roles: true,
        userDetail: {
          include: {
            bossInfo: {
              include: {
                orgs: true,
              },
            },
            workerInfo: {
              include: {
                session: true,
              },
            },
          },
        },
      },
    })

    const passwordIsValid = user
      ? bcrypt.compareSync(req.body.password, user.password)
      : false

    if (!user || !passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: '이메일 혹은 비밀번호가 틀렸습니다.',
      })
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration, // 24 hours
    })

    const refreshToken = await createToken(user)

    const authorities = [] as Array<String>
    user.roles.forEach((role) => {
      authorities.push(`ROLE_${role.name.toUpperCase()}`)
    })

    writeLog('SIGN_IN', {
      userId: user.id,
      accessToken: token,
      refreshToken: refreshToken,
    })

    res.status(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
      tokenExpiresIn: config.jwtExpiration,
      orgs: user.userDetail?.bossInfo?.orgs,
      session: user.userDetail?.workerInfo?.session,
    })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export async function refreshToken(req, res) {
  const { refreshToken: requestToken } = req.body

  if (requestToken == null) {
    return res.status(401).json({ message: 'Refresh Token is required!' })
  }

  try {
    const refreshToken = await db.refreshToken.findFirst({
      where: {
        token: requestToken,
      },
      include: { user: true },
    })

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Refresh token is not in database!' })
    }

    if (verifyExpiration(refreshToken)) {
      db.refreshToken.delete({ where: { userId: refreshToken.userId } })

      return res.status(401).json({
        message: 'Refresh token was expired. Please make a new signin request',
      })
    }

    const user = refreshToken.user
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    })

    writeLog('TOKEN_REFRESH', {
      userId: user.id,
      oldAccessToken: req.headers['x-access-token'],
      newAccessToken: newAccessToken,
      refreshToken: refreshToken.token,
    })

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    })
  } catch (err) {
    return res.status(500).send({ message: err })
  }
}

export default { signup, signin, refreshToken }
