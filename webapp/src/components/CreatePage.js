import React, { useCallback, useState } from 'react';
import { Link, navigate } from 'gatsby';
import { useMutation, gql } from '@apollo/client';
import { Button, Box, Input } from '../theme';

const CreatePage = ({ userId }) => {
  const [name, setName] = useState();
  const [createPage, { data, loading }] = useMutation(
    gql`
      mutation createPage($userId: ID!, $name: String!) {
        createPage(userId: $userId, name: $name) {
          id
          name
          published
        }
      }
    `,
    {
      variables: {
        name,
        userId,
      },
      update(cache, { data: { createPage: addedPage } }) {
        cache.modify({
          fields: {
            allUserPages(existing = []) {
              const newPageRef = cache.writeFragment({
                data: addedPage,
                fragment: gql`
                  fragment page on LandingPage {
                    id
                    name
                    published
                  }
                `,
              });

              return [newPageRef, ...existing];
            },
          },
        });
      },
    }
  );

  const handleCreateClick = useCallback(() => {
    createPage().then(res => {
      navigate(`/app/edit/${res.data.createPage.id}`);
    });
  }, []);

  if (data) {
    return (
      <Link to={`/pages/${data.createPage.id}`}>
        Start editing your landing page
      </Link>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Input
        placeholder="Name your page"
        name="name"
        value={name}
        flex={1}
        onChange={e => setName(e.target.value)}
      />
      <Button
        ml={2}
        variant="primary"
        disabled={loading}
        onClick={handleCreateClick}
      >
        Create new page
      </Button>
    </Box>
  );
};

export default CreatePage;
