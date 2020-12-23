/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import { navigate } from 'gatsby';
import { Auth0Provider } from '@auth0/auth0-react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { client } from './src/apollo';
import { theme } from './src/theme';

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <Auth0Provider
      navigate={navigate}
      domain="markdownlandingforany.eu.auth0.com"
      clientId="0cREuY0WqJZhHi7dux5iDkF0Y1HvgoA1"
      redirectUri={process.env.GATSBY_DOMAIN}
    >
      <ThemeProvider theme={theme}>{element}</ThemeProvider>
    </Auth0Provider>
  </ApolloProvider>
);
