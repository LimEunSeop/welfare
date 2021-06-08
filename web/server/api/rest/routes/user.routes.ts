import { authJwt } from '../middleware'
import controller from '../controllers/user.controller'
import express from 'express'

const userRouter = express.Router()

userRouter.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

// /rest/test/all
userRouter.get('/all', controller.allAccess)

// /rest/test/user
userRouter.get('/user', [authJwt.verifyToken], controller.userBoard)

// /rest/test/mod
userRouter.get(
  '/mod',
  [authJwt.verifyToken, authJwt.isModerator],
  controller.moderatorBoard
)

// /rest/test/admin
userRouter.get(
  '/admin',
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
)

export default userRouter
