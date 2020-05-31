// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import MuiFab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  fab: {
    bottom: theme.spacing(2),
    position: 'absolute',
    right: theme.spacing(2),
  },
}));

const Fab = ({ children, onClick, ...props }) => {
  const classes = useStyles();
  return (
    <Zoom in>
      <MuiFab className={classes.fab} color='primary' onClick={onClick} {...props}>
        {children}
      </MuiFab>
    </Zoom>
  );
};

Fab.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Fab;
