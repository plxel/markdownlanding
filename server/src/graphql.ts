import { ApolloServer, gql } from 'apollo-server-lambda';
import { allPublishedPages, allUserPages, page } from './queries';
import { updateUser, createPage, savePage, createStripeSession } from './mutations';

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
    published: Boolean!
  }

  type Query {
    allPublishedPages: [LandingPage!]!
    allUserPages(userId: ID!): [LandingPage!]!
    page(id: ID!, userId: ID!): LandingPage
  }

  type CreateStripeSessionPayload {
    sessionId: String!
  }

  type Mutation {
    updateUser(id: ID): User
    createPage(userId: ID!, name: String!): LandingPage
    savePage(id: ID!, userId: ID!, name: String!, content: String!): LandingPage
    createStripeSession(pageId: ID!, userId: ID!, returnTo: String!): CreateStripeSessionPayload!
  }
`;

const resolvers = {
  Query: {
    allPublishedPages,
    allUserPages,
    page,
  },
  Mutation: {
    updateUser,
    createPage,
    savePage,
    createStripeSession,
  },
};

const server = new ApolloServer({ typeDefs: schema, resolvers });

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
