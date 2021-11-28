import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBar = ({ leftButton, rightButtons, title }) => {
  const classes = useStyles();
  return (
    <MuiAppBar className={classes.appBar} position='absolute'>
      <Toolbar>
        {leftButton}

        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {title}
        </Typography>

        {rightButtons}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  leftButton: PropTypes.node.isRequired,
  rightButtons: PropTypes.node,
  title: PropTypes.string,
};

AppBar.defaultProps = {
  rightButtons: null,
  title: 'UnderBudget',
};

export default AppBar;
