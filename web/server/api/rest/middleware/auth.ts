import jwt, { TokenExpiredError } from 'jsonwebtoken'
import config from '../../../auth.config'
import { db } from '../../db'

const User = db.user

function catchError(err, res) {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: 'Unauthorized! Access Token was expired!' })
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' })
}

export async function verifyToken(req, res, next) {
  let token = req.headers['x-access-token']

  if (!token) {
    return res.status(401).send({
      message: 'No token provided!',
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res)
    }
    req.userId = decoded.id
    return next()
  })
}

export async function isAdmin(req, res, next) {
  const user = await User.findUnique({
    where: { id: req.userId },
    include: { roles: true },
  })

  if (user?.roles.some((role) => role.name === 'admin')) {
    return next()
  }

  res.status(403).send({
    message: 'Require Admin Role!',
  })
}

export async function isModerator(req, res, next) {
  const user = await User.findUnique({
    where: { id: req.userId },
    include: { roles: true },
  })

  if (user?.roles.some((role) => role.name === 'moderator')) {
    return next()
  }

  res.status(403).send({
    message: 'Require Moderator Role!',
  })
}

export async function isModeratorOrAdmin(req, res, next) {
  const user = await User.findUnique({
    where: { id: req.userId },
    include: { roles: true },
  })

  if (
    user?.roles.some(
      (role) => role.name === 'moderator' || role.name === 'admin'
    )
  ) {
    return next()
  }

  res.status(403).send({
    message: 'Require Moderator or Admin Role!',
  })
}

export async function canUseProgram(req, res, next) {
  const sessionId = Number(req.headers['x-program-session-id'])

  if (!sessionId) {
    return res
      .status(400)
      .send({ message: '프로그램 세션정보가 누락되었습니다.' })
  }

  // 유저 레코드 갖고와서 userRole 체크
  const user = await db.user.findUnique({
    where: { id: req.userId },
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
              session: {
                include: {
                  program: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const session = await db.programSession.findUnique({
    where: { id: sessionId },
  })

  if (!session) {
    return res
      .status(404)
      .send({ message: '해당 프로그램 세션이 존재하지 않습니다.' })
  }
  req.sessionId = session.id

  // 세션 만료여부 확인
  const sessionActive = session.expiryDate.getTime() > new Date().getTime()

  const roles = user ? user.roles : []

  // Admin, Moderater 이면 만료여부도 확인 안하고 프리패스
  // 후에 Admin, Moderator 가 기관을 가져 user 권한이 추가된다 하더라도 이 로직을 먼저 통과하므로 만료걱정 안해도 됨.
  if (
    roles.some((role) => role.name === 'moderator' || role.name === 'admin')
  ) {
    return next()
  }

  // User면 orgId 갖고있고 만료 안됐으면 패스.
  if (roles.some((role) => role.name === 'user')) {
    const orgs = user?.userDetail?.bossInfo?.orgs

    if (orgs?.some((org) => org.id === session.orgId)) {
      if (!sessionActive) {
        return res.status(402).send({
          message:
            '프로그램 사용기간이 만료되었습니다. 사용연장을 원하실 경우 추가결제 바랍니다.',
        })
      }
      return next()
    }
  }

  // Employee 면 sessionId 자체가 같아야지만 패스함
  if (roles.some((role) => role.name === 'employee')) {
    const userSession = user?.userDetail?.workerInfo?.session

    if (userSession?.id === session.id) {
      if (!sessionActive) {
        return res.status(402).send({
          message:
            '프로그램 사용기간이 만료되었습니다. 시설장에게 문의 바랍니다.',
        })
      }
      return next()
    }
  }

  return res
    .status(403)
    .send({ message: '해당 프로그램에 대한 권한이 없습니다.' })
}

export async function canControlOrganization(req, res, next) {
  const orgId = Number(req.headers['x-org-id'])

  if (!orgId) {
    return res.status(400).send({ message: '잘못된 접근입니다.' })
  }

  const user = await db.user.findUnique({
    where: { id: req.userId },
    include: {
      roles: true,
      userDetail: {
        include: {
          bossInfo: {
            include: {
              orgs: true,
            },
          },
        },
      },
    },
  })

  const roles = user ? user.roles : []

  switch (true) {
    case roles.some(
      (role) => role.name === 'moderator' || role.name === 'admin'
    ):
      break
    case roles.some((role) => role.name === 'user'):
      const orgs = user?.userDetail?.bossInfo?.orgs

      if (orgs?.some((org) => org.id === orgId)) {
        break
      } else {
        return res.status(403).send({ message: '잘못된 접근입니다.' })
      }
    default:
      return res.status(403).send({ message: '잘못된 접근입니다.' })
  }
  req.orgId = orgId

  return next()
}
