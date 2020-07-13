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
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  primaryButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {},
}));

const NavBar = ({
  actions,
  disableUserAccountButton,
  onPrimaryAction,
  primaryActionIcon,
  primaryActionLabel,
  title,
}) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} position='absolute'>
      <Toolbar className={classes.toolbar}>
        <IconButton
          aria-label={primaryActionLabel || 'open drawer'}
          className={classes.primaryButton}
          color='inherit'
          edge='start'
          onClick={onPrimaryAction}
        >
          {primaryActionIcon || <MenuIcon />}
        </IconButton>

        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {title}
        </Typography>

        {actions}
        {!disableUserAccountButton && <UserAccountToolbarButton edge='end' />}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  disableUserAccountButton: PropTypes.bool,
  onPrimaryAction: PropTypes.func.isRequired,
  primaryActionIcon: PropTypes.node,
  primaryActionLabel: PropTypes.string,
  title: PropTypes.string.isRequired,
};

NavBar.defaultProps = {
  actions: null,
  disableUserAccountButton: false,
  primaryActionIcon: null,
  primaryActionLabel: null,
};

export default NavBar;
