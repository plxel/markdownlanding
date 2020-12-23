import { gql } from '@apollo/client';

export const PAGE_QUERY = gql`
  query page($id: ID!, $userId: ID!) {
    page(id: $id, userId: $userId) {
      id
      name
      content
    }
  }
`;
