import { RefreshToken, User } from '.prisma/client'
import config from '../../../auth.config'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../db'
import { current } from './time'

export async function createToken(user: User) {
  const _token = uuidv4()
  const _expiryDate = current()
    .add(config.jwtRefreshExpiration, 'd')
    .hour(6)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString()

  const refreshToken = await db.refreshToken.upsert({
    where: {
      userId: user.id,
    },
    update: {
      token: _token,
      expiryDate: _expiryDate,
    },
    create: {
      userId: user.id,
      token: _token,
      expiryDate: _expiryDate,
    },
  })

  return refreshToken.token
}

export function verifyExpiration(token: RefreshToken) {
  return token.expiryDate.getTime() < new Date().getTime()
}
