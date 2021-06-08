require('dotenv').config()

export default {
  secret: process.env.AUTH_SECRET_KEY as string,
  jwtExpiration: 3600 as number, // 1 hour
  jwtRefreshExpiration: 86400 as number, // 24 hours

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
}
