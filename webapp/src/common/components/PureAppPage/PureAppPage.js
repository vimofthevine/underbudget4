import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

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
  container: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0),
    },
  },
  fab: {
    paddingBottom: theme.spacing(11),
  },
}));

const PureAppPage = ({ appBar, children, hasFab }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {appBar}
      <main className={classes.content} id='app-content'>
        {appBar && <div className={classes.appBarSpacer} />}
        <Container
          className={clsx(classes.container, {
            [classes.fab]: hasFab,
          })}
          maxWidth='lg'
        >
          {children}
        </Container>
      </main>
    </div>
  );
};

PureAppPage.propTypes = {
  appBar: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  hasFab: PropTypes.bool,
};

PureAppPage.defaultProps = {
  appBar: null,
  hasFab: false,
};

export default PureAppPage;
