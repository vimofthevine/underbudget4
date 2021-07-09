import Drawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  drawerPaper: {
    position: 'relative',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerPaperClosed: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  mobileDrawerPaper: {
    width: drawerWidth,
  },
}));

const PureDrawer = ({ children, onClose, onOpen, open, variant }) => {
  const classes = useStyles();
  if (variant === 'temporary') {
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
    return (
      <SwipeableDrawer
        anchor='left'
        classes={{ paper: clsx(classes.mobileDrawerPaper) }}
        // disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
      >
        {children}
      </SwipeableDrawer>
    );
  }
  return (
    <Drawer
      classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClosed) }}
      onClose={onClose}
      open={open}
      variant='permanent'
    >
      <div className={classes.appBarSpacer} />
      {children}
    </Drawer>
  );
};

PureDrawer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['temporary', 'permanent']),
};

PureDrawer.defaultProps = {
  variant: 'permanent',
};

export default PureDrawer;
