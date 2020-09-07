/* eslint-disable react/jsx-props-no-spreading */

import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import actionPropsShape from '../../utils/action-props';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  navButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const iterate = (arrayOfProps, func) => {
  if (arrayOfProps) {
    if (Array.isArray(arrayOfProps)) {
      return arrayOfProps.map((p, i) => func(p, i === arrayOfProps.length - 1));
    }
    return func(arrayOfProps, true);
  }
  return null;
};

const AppBar = ({ actions, navAction, title }) => {
  const classes = useStyles();

  return (
    <MuiAppBar className={classes.appBar} position='absolute'>
      <Toolbar>
        {navAction && (
          <IconButton className={classes.navButton} color='inherit' edge='start' {...navAction}>
            {navAction.icon}
          </IconButton>
        )}

        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {title}
        </Typography>

        {iterate(actions, (action, last) => (
          <IconButton color='inherit' edge={last ? 'end' : false} key={action.text} {...action}>
            {action.icon}
          </IconButton>
        ))}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  actions: PropTypes.oneOfType([actionPropsShape, PropTypes.arrayOf(actionPropsShape)]),
  navAction: actionPropsShape,
  title: PropTypes.string,
};

AppBar.defaultProps = {
  actions: null,
  navAction: null,
  title: 'UnderBudget',
};

export default AppBar;
