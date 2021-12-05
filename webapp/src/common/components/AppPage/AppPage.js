import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import AppDrawer from '../AppDrawer';
import HideOnScroll from './HideOnScroll';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: 0,
    display: 'flex',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  prominentAppBarSpacer: {
    minHeight: theme.spacing(16),
  },
  container: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0),
    },
  },
}));

const AppPage = ({ appBar, children, prominent }) => {
  const classes = useStyles();
  const mobile = useMobile();

  return (
    <div className={classes.root}>
      {mobile ? <HideOnScroll>{appBar}</HideOnScroll> : appBar}
      <AppDrawer />
      <main className={classes.content} id='app-content'>
        <div
          className={clsx(classes.appBarSpacer, { [classes.prominentAppBarSpacer]: prominent })}
        />
        <Container className={classes.container} maxWidth='lg'>
          {mobile ? children : <Paper>{children}</Paper>}
        </Container>
      </main>
    </div>
  );
};

AppPage.propTypes = {
  appBar: PropTypes.element.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  prominent: PropTypes.bool,
};

AppPage.defaultProps = {
  prominent: false,
};

export default AppPage;
