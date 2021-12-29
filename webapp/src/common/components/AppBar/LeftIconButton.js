import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
}));

const LeftIconButton = ({ icon, ...props }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.iconButton} color='inherit' edge='start' {...props}>
      {icon}
    </IconButton>
  );
};

LeftIconButton.propTypes = {
  icon: PropTypes.node.isRequired,
};

export default LeftIconButton;
