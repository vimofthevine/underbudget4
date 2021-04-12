import PropTypes from 'prop-types';
import React from 'react';
import { Router } from 'react-router-dom';

// This is basically the same thing as react-router's MemoryRouter, but
// uses a provided history instance

const MemoryRouter = ({ children, history }) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router action={state.action} location={state.location} navigator={history}>
      {children}
    </Router>
  );
};

MemoryRouter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  history: PropTypes.shape({
    action: PropTypes.string.isRequired,
    listen: PropTypes.func.isRequired,
    location: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default MemoryRouter;
