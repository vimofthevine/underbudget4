import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import NavBar from '../NavBar';
import NavDrawer from '../NavDrawer';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0),
    },
  },
  content: {
    flexGrow: 1,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    marginTop: theme.mixins.toolbar.minHeight,
    overflow: 'auto',
  },
  fab: {
    paddingBottom: theme.spacing(11),
  },
}));

const AppPage = ({ children, fab, navBarProps, title, toolbarAction }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleToggleDrawer = () => setDrawerOpen((old) => !old);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const classes = useStyles();

  return (
    <div style={{ display: 'flex' }}>
      <NavBar
        actions={toolbarAction}
        onPrimaryAction={handleToggleDrawer}
        title={title}
        {...navBarProps}
      />
      <NavDrawer onClose={handleCloseDrawer} open={isDrawerOpen} />
      <main className={classes.content} id='app-content'>
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
  navBarProps: PropTypes.shape({}),
  title: PropTypes.string,
  toolbarAction: PropTypes.element,
};

AppPage.defaultProps = {
  fab: false,
  navBarProps: null,
  title: 'UnderBudget',
  toolbarAction: null,
};

export default AppPage;
