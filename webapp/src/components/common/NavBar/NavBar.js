import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

import UserAccountToolbarButton from '../UserAccountToolbarButton';

const useStyles = makeStyles((theme) => ({
  accountButton: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {},
}));

const NavBar = ({ actionElement, onToggleDrawer, title }) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} position='absolute'>
      <Toolbar className={classes.toolbar}>
        <IconButton
          aria-label='open drawer'
          className={classes.menuButton}
          color='inherit'
          edge='start'
          onClick={onToggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {title}
        </Typography>

        <UserAccountToolbarButton edge={actionElement ? false : 'end'} />
        {actionElement}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  actionElement: PropTypes.element,
  onToggleDrawer: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

NavBar.defaultProps = {
  actionElement: null,
};

export default NavBar;
