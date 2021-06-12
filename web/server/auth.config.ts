require('dotenv').config()

export default {
  secret: process.env.AUTH_SECRET_KEY as string,
  jwtExpiration: 1800 as number, // 1 hour
  jwtRefreshExpiration: 14 as number, // days
}
