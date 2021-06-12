import { db } from '../../db'
import config from '../../../auth.config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createToken, verifyExpiration } from '../utils/token'

async function signup(req, res) {
  try {
    // Save db.user to Database
    const user = await db.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      },
    })

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

      res.send({ message: 'User was registered successfully!' })
    } else {
      // user role = 1
      await db.user.update({
        where: { id: user.id },
        data: {
          roles: {
            set: [{ id: 1 }],
          },
        },
      })

      res.send({ message: 'User was registered successfully!' })
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

async function signin(req, res) {
  try {
    const user = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
      include: {
        roles: true,
      },
    })

    if (!user) {
      return res.status(404).send({ message: 'User Not found.' })
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
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

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
      tokenExpiresIn: config.jwtExpiration,
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

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    })
  } catch (err) {
    return res.status(500).send({ message: err })
  }
}

export default { signup, signin, refreshToken }
