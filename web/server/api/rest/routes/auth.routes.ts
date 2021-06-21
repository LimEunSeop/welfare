import { verifySignUp } from '../middleware'
import controller from '../controllers/auth.controller'
import express from 'express'

const router = express.Router()

router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

// /rest/auth/signup
router.post(
  '/signup',
  [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
  controller.signup
)

// /rest/auth/signin
router.post('/signin', controller.signin)

// /rest/auth/refreshtoken
router.post('/refreshtoken', controller.refreshToken)

export default router
