import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch';

const SERVER_URI = process.env.GATSBY_MDL_GRAPHQL_API;

const httpLink = createHttpLink({
  uri: SERVER_URI
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  fetch
});
