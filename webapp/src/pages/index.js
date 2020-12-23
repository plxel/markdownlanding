import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { Box, Button } from '../theme';
import LoginButton from '../components/LoginButton';

const IndexPage = () => {
  const { isAuthenticated, loading } = useAuth0();

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <SEO title="Home" />
      <Box m={5} textAlign="center" fontSize={3}>
        Write a landing page for anything
        <br />
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && (
          <Box mt={3}>
            <Link to="/app">
              <Button variant="primary">Go to dashboard</Button>
            </Link>
          </Box>
        )}
      </Box>
    </Layout>
  );
};
export default IndexPage;
