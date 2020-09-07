/* eslint-disable react/jsx-props-no-spreading */

import MuiFab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import React from 'react';

import actionPropsShape from '../../utils/action-props';

const useStyles = makeStyles((theme) => ({
  fab: {
    bottom: theme.spacing(2),
    position: 'absolute',
    right: theme.spacing(2),
  },
}));

const PureFab = ({ action, ...props }) => {
  const classes = useStyles();
  return (
    <Zoom in>
      <MuiFab className={classes.fab} color='primary' {...action} {...props}>
        {action.icon}
      </MuiFab>
    </Zoom>
  );
};

PureFab.propTypes = {
  action: actionPropsShape.isRequired,
};

export default PureFab;
