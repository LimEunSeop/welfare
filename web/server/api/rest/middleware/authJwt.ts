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
    next()
  })
}

export async function isAdmin(req, res, next) {
  const user = await User.findUnique({
    where: { id: req.userId },
    include: { roles: true },
  })

  if (user?.roles.some((role) => role.name === 'admin')) {
    next()
    return
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
    next()
    return
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
    next()
    return
  }

  res.status(403).send({
    message: 'Require Moderator or Admin Role!',
  })
}
