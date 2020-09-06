/* eslint-disable react/jsx-props-no-spreading */

import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';

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
      return arrayOfProps.map((p, i) => func(p, i, i === arrayOfProps.length - 1));
    }
    return func(arrayOfProps, 0, true);
  }
  return null;
};

const AppBar = ({ actionProps, navActionProps, title }) => {
  const classes = useStyles();

  return (
    <MuiAppBar className={classes.appBar} position='absolute'>
      <Toolbar>
        {navActionProps && (
          <IconButton
            className={classes.navButton}
            color='inherit'
            edge='start'
            {...navActionProps}
          />
        )}

        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {title}
        </Typography>

        {iterate(actionProps, (props, key, last) => (
          <IconButton color='inherit' edge={last ? 'end' : false} key={key} {...props} />
        ))}
      </Toolbar>
    </MuiAppBar>
  );
};

const actionPropsShape = PropTypes.shape({
  'aria-label': PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
});

AppBar.propTypes = {
  actionProps: PropTypes.oneOfType([actionPropsShape, PropTypes.arrayOf(actionPropsShape)]),
  navActionProps: actionPropsShape,
  title: PropTypes.string,
};

AppBar.defaultProps = {
  actionProps: null,
  navActionProps: null,
  title: 'UnderBudget',
};

export default AppBar;
