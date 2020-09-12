import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import useSelection from '../../hooks/useSelection';
import actionPropsShape from '../../utils/action-props';
import toList from '../../utils/to-list';
import NavIconList from '../NavIconList';
import PureActionMenu from '../PureActionMenu';
import PureAppBar from '../PureAppBar';
import PureDrawer from '../PureDrawer';
import UserMenu from '../UserMenu';

const FullAppBar = ({ primaryActions, selectionActions, title }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setDrawerOpen((old) => !old);

  const { clear, selected } = useSelection();
  const hasSelection = selected && selected.length > 0;

  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const handleOpenUserMenu = (e) => setUserMenuAnchor(e.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchor(null);

  const [overflowMenuAnchor, setOverflowMenuAnchor] = React.useState(null);
  const handleOpenOverflowMenu = (e) => setOverflowMenuAnchor(e.currentTarget);
  const handleCloseOVerflowMenu = () => setOverflowMenuAnchor(null);

  const mobile = useMobile();

  const navActionProps = hasSelection
    ? {
        'aria-label': 'clear selection',
        icon: <CloseIcon />,
        onClick: clear,
        text: 'Clear selection',
      }
    : {
        'aria-label': 'open nav drawer',
        icon: <MenuIcon />,
        onClick: toggleDrawer,
        text: 'Toggle nav drawer',
      };

  const appBarTitle = hasSelection ? `${selected.length} Selected` : title;

  let actionProps = toList(hasSelection ? selectionActions : primaryActions);
  if (!hasSelection && !mobile) {
    actionProps.push({
      'aria-label': 'open account menu',
      icon: <AccountCircleIcon />,
      onClick: handleOpenUserMenu,
      text: 'Open account menu',
    });
  }

  let overflowMenu = null;

  if (mobile && actionProps.length > 2) {
    overflowMenu = (
      <PureActionMenu
        actions={actionProps}
        anchor={overflowMenuAnchor}
        onClose={handleCloseOVerflowMenu}
      />
    );
    actionProps = {
      'aria-label': 'open actions menu',
      icon: <MoreVertIcon />,
      onClick: handleOpenOverflowMenu,
      text: 'Open actions menu',
    };
  }

  return (
    <>
      <PureAppBar actions={actionProps} navAction={navActionProps} title={appBarTitle} />
      <UserMenu anchor={userMenuAnchor} onClose={handleCloseUserMenu} />
      {overflowMenu}
      <PureDrawer
        onClose={toggleDrawer}
        open={drawerOpen}
        variant={mobile ? 'temporary' : 'permanent'}
      >
        <NavIconList />
      </PureDrawer>
    </>
  );
};

const actionPropsType = PropTypes.oneOfType([
  actionPropsShape,
  PropTypes.arrayOf(actionPropsShape),
]);

FullAppBar.propTypes = {
  primaryActions: actionPropsType,
  selectionActions: actionPropsType,
  title: PropTypes.string,
};

FullAppBar.defaultProps = {
  primaryActions: null,
  selectionActions: null,
  title: undefined,
};

export default FullAppBar;
