import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

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
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24,
  },
}));

const NavBar = ({ onOpenAccountMenu, onToggleDrawer, title }) => {
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

        <IconButton
          aria-label='open account menu'
          className={classes.accountButton}
          color='inherit'
          edge='end'
          onClick={onOpenAccountMenu}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  onOpenAccountMenu: PropTypes.func.isRequired,
  onToggleDrawer: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default NavBar;
