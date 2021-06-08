import express from 'express'
import authRouter from './routes/auth.routes'
import userRouter from './routes/user.routes'

export const restApiRouter = express.Router()

restApiRouter.use('/auth', authRouter)
restApiRouter.use('/test', userRouter)
