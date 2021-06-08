import { app, server } from './server'

const PORT = process.env.SERVER_PORT || 3001

app.listen(PORT, () => {
  console.log(
    `Server ready at http://localhost:${PORT}\nGraphQL path: http://localhost:${PORT}${server.graphqlPath}`
  )
})
