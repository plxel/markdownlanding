import React from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'gatsby';
import { gql, useQuery } from '@apollo/client';
import { Box } from '../theme';
import CreatePage from './CreatePage';

const Row = styled(Box).attrs({
  p: 2,
  borderBottom: 1,
  borderBottomStyle: 'dashed',
  borderColor: 'grays.2',
  display: 'flex',
  justifyContent: 'space-between',
})`
  &:hover {
    background-color: ${props => props.theme.colors.grays[0]};
  }
`;

const useUserPages = user => {
  const { data } = useQuery(
    gql`
      query allUserPages($userId: ID!) {
        allUserPages(userId: $userId) {
          id
          name
          published
        }
      }
    `,
    { variables: { userId: user?.sub } }
  );

  return data?.allUserPages || [];
};

const Dashboard = () => {
  const { user } = useAuth0();

  const pages = useUserPages(user);

  if (!user) {
    return null;
  }

  return (
    <Box width="500px" mx="auto">
      <CreatePage userId={user.sub} />
      <Box mt={4}>
        {pages.map(page => (
          <Row key={page.id}>
            <div>{page.name}</div>
            <div>
              <Link to={`/app/edit/${page.id}`}>Edit</Link>{' '}
              {!page.published && (
                <Link to={`/app/publish/${page.id}`}>Publish</Link>
              )}
              {page.published && (
                <a target="_blank" rel="noreferrer" href={`/pages/${page.id}`}>
                  Open
                </a>
              )}
            </div>
          </Row>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
