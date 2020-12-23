import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { loadStripe } from '@stripe/stripe-js';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'gatsby';
import { PAGE_QUERY } from './gql';
import { Button, Box } from '../theme';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_KEY);

const PublishPage = ({ id }) => {
  const { user } = useAuth0();

  const { data } = useQuery(PAGE_QUERY, {
    variables: { id, userId: user?.sub },
  });

  const [createSession] = useMutation(gql`
    mutation createStripeSession(
      $pageId: ID!
      $userId: ID!
      $returnTo: String!
    ) {
      createStripeSession(
        pageId: $pageId
        userId: $userId
        returnTo: $returnTo
      ) {
        sessionId
      }
    }
  `);

  const handlePublishPage = useCallback(async () => {
    const result = await createSession({
      variables: {
        pageId: id,
        userId: user.sub,
        returnTo: window.location.origin,
      },
    });

    if (!result?.data?.createStripeSession?.sessionId) {
      return;
    }

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      sessionId: result.data.createStripeSession.sessionId,
    });
  }, [id, user]);

  if (!data?.page?.content) {
    return null;
  }

  return (
    <div>
      <Box mb={3}>
        <Link to="/">
          <Button variant="text"> {'<'} Back to dashboard</Button>
        </Link>
      </Box>
      <Box display="flex" mt={3}>
        <Box flex="1" mr="5" borderRight="1" pr={3}>
          <Box mb={3}>
            <strong>1$ for single publication.</strong> Any updates after is{' '}
            <strong>free</strong>
            <br />
            <br />
            After successful publishing your page will be available at{' '}
            {`${window.location.origin}/pages/${id}`}
            <br />
            <br />
            It takes some time after payment to publish page. Usually page is
            available after few minutes
          </Box>
          <Box textAlign="right">
            <Button variant="primary" onClick={handlePublishPage}>
              Pay with Stripe
            </Button>
          </Box>
        </Box>
        <Box flex="2">
          <ReactMarkdown>{data.page.content}</ReactMarkdown>
        </Box>
      </Box>
    </div>
  );
};

export default PublishPage;
