import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../../hooks/useMobile';
import AccountMenu from '../UserAccountMenu';

const UserAccountToolbarButton = ({ edge }) => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  return useMobile() ? null : (
    <>
      <IconButton aria-label='open account menu' color='inherit' edge={edge} onClick={handleOpen}>
        <AccountCircleIcon />
      </IconButton>
      <AccountMenu anchor={anchor} onClose={handleClose} />
    </>
  );
};

UserAccountToolbarButton.propTypes = {
  edge: PropTypes.string,
};

UserAccountToolbarButton.defaultProps = {
  edge: false,
};

export default UserAccountToolbarButton;
