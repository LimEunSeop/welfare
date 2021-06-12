import jwt from 'jsonwebtoken'
import { db } from './db'
import { Prisma, PrismaClient, Role, User } from '@prisma/client'
import authConfig from '../auth.config'

type UserIncludesRole = Prisma.Prisma__UserClient<
  (User & { roles: Role[] }) | null
>

export interface Context {
  db: PrismaClient
  user: UserIncludesRole
}

export const context = function ({ req }) {
  let user: UserIncludesRole | null = null
  if (req.headers['x-access-token']) {
    const token = req.headers['x-access-token']
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (!err) {
        user = db.user.findUnique({
          where: { id: decoded.id },
          include: { roles: true },
        })
      }
    })
  }

  return { db, user }
}
