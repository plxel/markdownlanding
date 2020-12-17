import React, { useState, useEffect } from 'react';

import { useAuth0 } from '@auth0/auth0-react'
import { useStaticQuery, graphql, Link } from "gatsby"
import { Button, Box, Input } from 'theme-ui'
import { useMutation, gql, useQuery } from '@apollo/client'

const CreatePage = ({ userId }) => {
  const [name, setName] = useState()
  const [createPage, { data, loading }] = useMutation(
    gql`
      mutation createPage($userId: ID!, $name: String!) {
        createPage(userId: $userId, name: $name) {
          id
        }
      }
    `,
    {
      variables: { 
        name,
        userId
       }
    }
  )

  if (data) {
    return <Link to={`/pages/${data.createPage.id}`}>Start editing your landing page</Link>
  }

  return (
    <div>
      <Input
        placeholder='Name your page'
        name="name"
        value={name}
        onChange={e => setName(e.target.value)} />
      <Button disabled={loading} onClick={() => createPage()}>Create new page</Button>
    </div>
  )
}


export const Dashboard = () => {
  const { user } = useAuth0();

  
  const data = useStaticQuery(graphql`
    query {
      mdlapi {
        allPages {
          id
          userId
          createdAt
          name
        }
      }
    }
  `)

  // TODO: this is insecure, we should filter on the server
  const pages = data.mdlapi.allPages.filter(page => page.userId === user?.sub)

  const [list, setList] = useState(pages)

  const liveData = useQuery(gql`
    query {
          allPages {
          id
          userId
          createdAt
          name
        }
    }
  `)

  useEffect(() => {
    if (liveData.data) {
      setList(liveData.data.allPages.filter(page => page.userId === user?.sub))
    }
  }, [liveData.data])

  if (!user) {
    return null;
  }


  return <div>

    {user.nickname}
  <CreatePage userId={user.sub} />
    <div>
      {list.map(page => <div><Link to={`/pages/${page.id}`}>{page.name}</Link></div>)}
    </div>
    
  </div>
}