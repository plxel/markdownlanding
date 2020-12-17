/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useEffect } from "react"

import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { Button, Box } from 'theme-ui'
import { useAuth } from 'react-use-auth'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useAuth0 } from "@auth0/auth0-react";
import { Dashboard } from '../components/Dashboard'

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, loading, user, logout } = useAuth0()

  const [updateUser] = useMutation(
    gql`
      mutation updateUser($id: ID!) {
        updateUser(id: $id) {
          id
        }
      } 
    `,
    {
      variables: {
        id: user?.id,
      }
    }
  );

  useEffect(() => {
    if (user?.id) {
      updateUser()
    }
  }, [user?.id])

  console.log(user?.id);

  if (loading) {
    return "loading..."
  }

  if (isAuthenticated) {
    return <Button mb={2} variant='primary' onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
  }

  return <Button mb={2} variant='primary' onClick={() => loginWithRedirect()}>Get started</Button>

}

const IndexPage = () => {
  const { isAuthenticated, user, login } = useAuth0()

  const data = useStaticQuery(graphql`
    query {
      mdlapi {
        hello {
          world
        }
      }
    }
  `)

  const { data: liveData, loading } = useQuery(gql`
    query {
      hello {
        world
      }
    }
  `)
  return (
    <Layout>
      <SEO title="Home" />
      <Box bg='primary'>Write a landing page for anything</Box>
      {isAuthenticated ? <Dashboard /> : null}
      <p>From graphql server: {liveData ? liveData.hello.world : data.mdlapi.hello.world}</p>
      <LoginButton />
      
    </Layout>
  )
}
export default IndexPage
