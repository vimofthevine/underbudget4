import MuiDrawer from '@material-ui/core/Drawer';
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
}));

const PureDrawer = ({ children, onClose, open, variant }) => {
  const classes = useStyles();
  return (
    <MuiDrawer
      classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClosed) }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      {variant === 'permanent' && <div className={classes.appBarSpacer} />}
      {children}
    </MuiDrawer>
  );
};

PureDrawer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['temporary', 'permanent']),
};

PureDrawer.defaultProps = {
  variant: 'permanent',
};

export default PureDrawer;
