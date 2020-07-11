import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

import { useSelection } from '../../contexts/selection';
import useMobile from '../../hooks/useMobile';
import UserToolbarButton from '../UserToolbarButton';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  primaryButton: {
    marginRight: theme.spacing(4),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBar = ({ onToggleDrawer, secondaryActions, selectionActions, title }) => {
  const mobile = useMobile();
  const classes = useStyles();
  const { selected, clear } = useSelection();
  const hasSelection = selected && selected.length > 0;

  return (
    <MuiAppBar className={classes.appBar} position='absolute'>
      <Toolbar>
        <IconButton
          aria-label={hasSelection ? 'clear selection' : 'open menu'}
          className={classes.primaryButton}
          color='inherit'
          edge='start'
          onClick={hasSelection ? clear : onToggleDrawer}
        >
          {hasSelection ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        <Typography className={classes.title} color='inherit' component='h1' noWrap variant='h6'>
          {hasSelection ? `${selected.length} Selected` : title}
        </Typography>

        {hasSelection && selectionActions}
        {!hasSelection && (
          <>
            {secondaryActions}
            {!mobile && <UserToolbarButton />}
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  onToggleDrawer: PropTypes.func.isRequired,
  secondaryActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  selectionActions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  title: PropTypes.string,
};

AppBar.defaultProps = {
  secondaryActions: null,
  selectionActions: null,
  title: 'UnderBudget',
};

export default AppBar;
