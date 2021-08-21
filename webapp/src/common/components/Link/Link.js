import MuiLink from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Link = ({ children, to, ...props }) => {
  const { search, state } = useLocation();
  const toWithSearch = React.useMemo(
    () => (typeof to === 'string' ? { pathname: to, search } : { search, to }),
    [search, to],
  );
  return (
    <MuiLink color='secondary' component={RouterLink} state={state} to={toWithSearch} {...props}>
      {children}
    </MuiLink>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ pathname: PropTypes.string, search: PropTypes.string }),
  ]).isRequired,
};

export default Link;
