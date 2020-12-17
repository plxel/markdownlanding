import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch';

const SERVER_URI = 'https://g1j1zjqq7d.execute-api.us-east-1.amazonaws.com/dev/graphql'

const httpLink = createHttpLink({
  uri: SERVER_URI
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  fetch
});
