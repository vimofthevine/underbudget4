import Drawer from '@material-ui/core/Drawer';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import NavMenu from '../NavMenu';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    transition: theme.transitions.create('width', {
      during: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerPaperClosed: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      during: theme.transitions.duration.leavingScreen,
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
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClosed) }}
      onClose={onClose}
      open={open}
      variant={mobile ? 'temporary' : 'permanent'}
    >
      <NavMenu showAccountMenu={mobile} />
    </Drawer>
  );
};

NavDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NavDrawer;
