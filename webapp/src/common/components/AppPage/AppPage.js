import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import AppDrawer from '../AppDrawer';
import PureAppPage from '../PureAppPage';

const AppPage = ({ appBar, children }) => {
  const mobile = useMobile();
  return (
    <PureAppPage appBar={appBar} appDrawer={<AppDrawer />}>
      {mobile ? children : <Paper>{children}</Paper>}
    </PureAppPage>
  );
};

AppPage.propTypes = {
  appBar: PureAppPage.propTypes.appBar,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

AppPage.defaultProps = {
  appBar: PureAppPage.defaultProps.appBar,
};

export default AppPage;
