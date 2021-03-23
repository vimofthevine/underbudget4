import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

// This does everything that react-router's MemoryRouter does, but gives
// us access to the history instance
export default (props) => {
  const historyRef = React.useRef();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory(props);
  }

  const history = historyRef.current;
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  const routerProps = {
    action: state.action,
    location: state.location,
    navigator: history,
  };

  return { history, routerProps, Router };
};
