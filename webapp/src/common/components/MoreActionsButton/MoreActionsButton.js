import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

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

MoreActionsButton.propTypes = PureActionMenu.propTypes;

MoreActionsButton.defaultProps = PureActionMenu.defaultProps;

export default MoreActionsButton;
