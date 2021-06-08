import { RefreshToken, User } from '.prisma/client'
import config from '../../../auth.config'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'

export async function createToken(user: User) {
  let expiredAt = new Date()

  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration)

  let _token = uuidv4()

  let refreshToken = await db.refreshToken.upsert({
    where: {
      userId: user.id,
    },
    update: {
      token: _token,
      expiryDate: expiredAt.toISOString(),
    },
    create: {
      userId: user.id,
      token: _token,
      expiryDate: expiredAt.toISOString(),
    },
  })

  return refreshToken.token
}

export function verifyExpiration(token: RefreshToken) {
  return token.expiryDate.getTime() < new Date().getTime()
}
