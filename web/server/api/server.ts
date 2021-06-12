import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { context } from './context'
import { schema } from './schema'
import { join } from 'path'
import { restApiRouter } from './rest'
import cors from 'cors'
import { db } from './db'

function applyExpressMiddleware(app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(cors())
  }
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join('..', 'client', 'build')))
  }

  // parse requests of content-type - application/json
  app.use(express.json())

  // parse request of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }))

  app.use('/rest', restApiRouter)
}

async function dbInit() {
  const Role = db.role

  await Role.upsert({
    where: { id: 1 },
    update: { name: 'user' },
    create: { name: 'user' },
  })
  await Role.upsert({
    where: { id: 2 },
    update: { name: 'moderator' },
    create: { name: 'moderator' },
  })
  await Role.upsert({
    where: { id: 3 },
    update: { name: 'admin' },
    create: { name: 'admin' },
  })
}

export const app = express()
export const server = new ApolloServer({ schema, context })
server.applyMiddleware({ app })
applyExpressMiddleware(app)
dbInit()
