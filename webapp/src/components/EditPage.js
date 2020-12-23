import React, { useCallback, useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, navigate } from 'gatsby';
import ReactMarkdown from 'react-markdown';
import { Textarea, Button, Input, Box } from '../theme';

import { PAGE_QUERY } from './gql';

const DEFAULT_TEXT = `
### This is an example

You can use *markdown* **language**

You can see preview of your page on the right
`;

const EditPage = ({ id }) => {
  const { user } = useAuth0();
  const [name, setName] = useState();
  const [content, setContent] = useState();

  const { data } = useQuery(PAGE_QUERY, {
    variables: { id, userId: user?.sub },
  });

  const [savePageContent] = useMutation(
    gql`
      mutation savePage(
        $id: ID!
        $userId: ID!
        $name: String!
        $content: String!
      ) {
        savePage(id: $id, userId: $userId, name: $name, content: $content) {
          id
          name
          content
          lastUpdatedAt
        }
      }
    `,
    {
      variables: { id, userId: user?.sub, content, name },
    }
  );

  useEffect(() => {
    if (data?.page) {
      setName(data.page.name);
      setContent(data.page.content || DEFAULT_TEXT);
    }
  }, [data]);

  const handleChange = useCallback(
    e => {
      if (e.target.name === 'name') {
        setName(e.target.value);
      } else {
        setContent(e.target.value);
      }
    },
    [setName, setContent]
  );

  const handleSave = useCallback(() => {
    savePageContent().then(() => {
      navigate('/app');
    });
  }, [savePageContent]);

  return (
    <div>
      {Boolean(data?.page) && (
        <div>
          <Box mb={3}>
            <Link to="/">
              <Button variant="text"> {'<'} Back to dashboard</Button>
            </Link>
          </Box>
          <Input name="name" value={name} onChange={handleChange} />

          <Box display="flex" mt={3}>
            <Box flex="1" mr={4}>
              <Textarea
                placeholder="Your page content"
                name="content"
                value={content}
                onChange={handleChange}
                width="100%"
                height="50vh"
              />
              <Box textAlign="right" mt={3}>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
            <Box flex="1">
              <ReactMarkdown>{content}</ReactMarkdown>
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};

export default EditPage;
