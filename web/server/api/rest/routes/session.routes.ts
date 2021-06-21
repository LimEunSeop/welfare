import { auth } from '../middleware'
import controller from '../controllers/session.controller'
import express from 'express'

const router = express.Router()

router.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

router.post(
  '/',
  [auth.verifyToken, auth.canControlOrganization],
  controller.addProgramSession
)

router.get(
  '/',
  [auth.verifyToken, auth.canControlOrganization],
  controller.getProgramSessionList
)

// /rest/sessions/:sessionId
router.get(
  '/:sessionId',
  [auth.verifyToken, auth.canUseProgram],
  controller.getProgramSession
)

export default router
