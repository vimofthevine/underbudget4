import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AccountMenu from '../AccountMenu';
import NavBar from '../NavBar';
import NavDrawer from '../NavDrawer';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0),
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  fab: {
    paddingBottom: theme.spacing(11),
  },
}));

const AppPage = ({ children, fab, title }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleToggleDrawer = () => setDrawerOpen((old) => !old);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const handleOpenAccountMenu = (event) => setAccountMenuAnchor(event.currentTarget);
  const handleCloseAccountMenu = () => setAccountMenuAnchor(null);

  const classes = useStyles();

  return (
    <div style={{ display: 'flex' }}>
      <NavBar
        onOpenAccountMenu={handleOpenAccountMenu}
        onToggleDrawer={handleToggleDrawer}
        title={title}
      />
      <NavDrawer onClose={handleCloseDrawer} open={isDrawerOpen} />
      <AccountMenu anchor={accountMenuAnchor} onClose={handleCloseAccountMenu} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container
          className={clsx(classes.container, {
            [classes.fab]: fab,
          })}
          maxWidth='lg'
        >
          {children}
        </Container>
      </main>
    </div>
  );
};

AppPage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  fab: PropTypes.bool,
  title: PropTypes.string,
};

AppPage.defaultProps = {
  fab: false,
  title: 'UnderBudget',
};

export default AppPage;
