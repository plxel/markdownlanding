import React, { useEffect } from 'react';

import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../theme';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, loading, user } = useAuth0();

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
      },
    }
  );

  useEffect(() => {
    if (user?.id) {
      updateUser();
    }
  }, [user?.id]);

  if (loading || isAuthenticated) {
    return null;
  }

  return (
    <Button mt={4} variant="secondary" onClick={() => loginWithRedirect()}>
      Get started
    </Button>
  );
};

export default LoginButton;
