import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import NavDrawer from '../../../components/common/NavDrawer';
import AppBar from '../AppBar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
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

const AppPage = ({ appBarProps, children, hasFab }) => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const handleToggleDrawer = () => setDrawerOpen((old) => !old);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar onToggleDrawer={handleToggleDrawer} {...appBarProps} />
      <NavDrawer onClose={handleCloseDrawer} open={isDrawerOpen} />
      <main className={classes.content} id='app-content'>
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

AppPage.propTypes = {
  appBarProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  hasFab: PropTypes.bool,
};

AppPage.defaultProps = {
  hasFab: false,
};

export default AppPage;
