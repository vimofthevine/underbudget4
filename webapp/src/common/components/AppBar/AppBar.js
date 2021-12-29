import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  prominentTitle: {
    alignSelf: 'flex-end',
  },
  prominentToolbar: {
    alignItems: 'flex-start',
    minHeight: theme.spacing(16),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBar = ({ leftButton, prominent, rightButtons, title }) => {
  const classes = useStyles();

  return (
    <MuiAppBar className={classes.appBar} position='fixed'>
      <Toolbar className={clsx({ [classes.prominentToolbar]: prominent })}>
        {leftButton}

        <Typography
          className={clsx(classes.title, { [classes.prominentTitle]: prominent })}
          color='inherit'
          component='h1'
          noWrap={!prominent}
          variant='h6'
        >
          {title}
        </Typography>

        {rightButtons}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  leftButton: PropTypes.node.isRequired,
  prominent: PropTypes.bool,
  rightButtons: PropTypes.node,
  title: PropTypes.string,
};

AppBar.defaultProps = {
  prominent: false,
  rightButtons: null,
  title: 'UnderBudget',
};

export default AppBar;
