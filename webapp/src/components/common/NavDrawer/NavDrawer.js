import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../../common/hooks/useMobile';
import NavDrawerList from '../NavDrawerList';

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

const NavDrawer = ({ onClose, open }) => {
  const classes = useStyles();
  const mobile = useMobile();

  return (
    <Drawer
      classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClosed) }}
      onClose={onClose}
      open={open}
      variant={mobile ? 'temporary' : 'permanent'}
    >
      <div className={classes.appBarSpacer} />
      <NavDrawerList showAccountItems={mobile} />
    </Drawer>
  );
};

NavDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NavDrawer;
