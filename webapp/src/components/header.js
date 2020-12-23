import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button } from '../theme';

const Header = ({ siteTitle }) => {
  const { isAuthenticated, logout } = useAuth0();
  return (
    <Box
      mb={4}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="black"
      color="white"
      py={2}
      px={4}
    >
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <div>
        {isAuthenticated && (
          <Button
            variant="text"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        )}
      </div>
    </Box>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
