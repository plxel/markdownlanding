import { ApolloServer, gql } from 'apollo-server-lambda'
import { allPages, page } from './queries'
import { updateUser, createPage, savePage } from './mutations'

const schema = gql`
  type User {
    id: ID!
    createdAt: String!
    lastSignedInAt: String!
  }

  type LandingPage {
    id: ID!
    userId: String!
    createdAt: String!
    lastUpdatedAt: String!
    name: String!
    content: String!
  }

  type Query {
    allPages: [LandingPage!]!
    page(id: ID!, userId: ID!): LandingPage
  }

  type Mutation {
    updateUser(id: ID): User
    createPage(userId: ID!, name: String!): LandingPage
    savePage(id: ID!, userId: ID!, content: String!): LandingPage
  }
`

const resolvers = {
  Query: {
    allPages,
    page,
  },
  Mutation: {
    updateUser,
    createPage,
    savePage
  }
}

const server = new ApolloServer({ typeDefs: schema, resolvers })

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
})