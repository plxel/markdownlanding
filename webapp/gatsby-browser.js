/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import { navigate } from 'gatsby'
import { AuthConfig, Providers } from 'react-use-auth'
import { Auth0Provider } from "@auth0/auth0-react";
import { ApolloProvider } from '@apollo/client'
import { client } from './src/apollo'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <Auth0Provider
      navigate={navigate}
    domain="markdownlandingforany.eu.auth0.com"
      clientId="0cREuY0WqJZhHi7dux5iDkF0Y1HvgoA1"
      redirectUri={window.location.origin}
    >
      {element}</Auth0Provider>
</ApolloProvider>
)