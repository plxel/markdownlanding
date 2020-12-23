import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { Box } from '../theme';
import { PAGE_QUERY } from '../components/gql';

const useLandingPageData = ({ pageContext }) => {
  const { id, userId } = pageContext;
  const [pageContent, setPageContent] = useState(pageContext.content);

  const { data } = useQuery(PAGE_QUERY, { variables: { id, userId } });

  useEffect(() => {
    if (data) {
      setPageContent(data.page.content);
    }
  }, [data]);

  return { pageContent };
};

const LandingPage = ({ pageContext }) => {
  const { pageContent } = useLandingPageData({
    pageContext,
  });

  return (
    <Box p={4} maxWidth="900px" minHeight="100vh" mx="auto" bg="grays.0">
      <ReactMarkdown>{pageContent}</ReactMarkdown>
    </Box>
  );
};

export default LandingPage;
