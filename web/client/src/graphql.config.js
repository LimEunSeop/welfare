import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  makeVar,
} from '@apollo/client'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

// Reactive Variables
export const vars = {
  currentUser: makeVar(null),
  visibility: makeVar({ user: false, moderator: false, admin: false }),
  currentSession: makeVar(null),
  sessionList: makeVar(null),
}

export default function GraphQLProvider({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
