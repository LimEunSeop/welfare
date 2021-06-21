import express from 'express'
import authRouter from './routes/auth.routes'
import sessionRouter from './routes/session.routes'

export const restApiRouter = express.Router()

restApiRouter.use('/auth', authRouter)
restApiRouter.use('/sessions', sessionRouter)
