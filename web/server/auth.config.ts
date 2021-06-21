require('dotenv').config()

export default {
  secret: process.env.AUTH_SECRET_KEY as string,
  jwtExpiration: 1800 as number, // seconds
  jwtRefreshExpiration: 1 as number, // days
}
