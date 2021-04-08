import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React from 'react';

import actionPropsShape from '../../utils/action-props';
import PureActionMenu from '../PureActionMenu';

const MoreActionsButton = ({ actions }) => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);
  return (
    <>
      <IconButton aria-label='Open actions menu' onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <PureActionMenu actions={actions} anchor={anchor} onClose={handleClose} />
    </>
  );
};

MoreActionsButton.propTypes = {
  actions: PropTypes.arrayOf(actionPropsShape).isRequired,
};

export default MoreActionsButton;
