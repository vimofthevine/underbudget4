import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import useNavigateKeepingSearch from '../../hooks/useNavigateKeepingSearch';
import useSelection from '../../hooks/useSelection';
import actionPropsShape from '../../utils/action-props';
import toList from '../../utils/to-list';
import NavIconList from '../NavIconList';
import PureActionMenu from '../PureActionMenu';
import PureAppBar from '../PureAppBar';
import PureDrawer from '../PureDrawer';
import useDrawerState from './useDrawerState';

const FullAppBar = ({ back, primaryActions, secondaryActions, selectionActions, title }) => {
  const [drawerOpen, toggleDrawer] = useDrawerState();

  const { clear, selected } = useSelection();
  const hasSelection = selected && selected.length > 0;

  const [overflowMenuAnchor, setOverflowMenuAnchor] = React.useState(null);
  const handleOpenOverflowMenu = (e) => setOverflowMenuAnchor(e.currentTarget);
  const handleCloseOverflowMenu = () => setOverflowMenuAnchor(null);

  const mobile = useMobile();
  const navigate = useNavigateKeepingSearch();

  const navActionProps = React.useMemo(() => {
    if (hasSelection) {
      return {
        'aria-label': 'clear selection',
        icon: <CloseIcon />,
        onClick: clear,
        text: 'Clear selection',
      };
    }
    if (back) {
      return {
        'aria-label': 'go to previous page',
        icon: <ArrowBackIcon />,
        onClick: () => navigate(typeof back === 'function' ? back() : back),
        text: 'Go to previous page',
      };
    }
    return {
      'aria-label': 'open nav drawer',
      icon: <MenuIcon />,
      onClick: toggleDrawer,
      text: 'Toggle nav drawer',
    };
  }, [back, clear, hasSelection, navigate, toggleDrawer]);

  const appBarTitle = hasSelection ? `${selected.length} Selected` : title;

  let actionProps = toList(hasSelection ? selectionActions : primaryActions);
  let overflowActions = hasSelection ? [] : toList(secondaryActions);
  let overflowMenu = null;

  // If we have to truncate, move all actions into overflow actions
  if (mobile && actionProps.length + overflowActions.length > 2) {
    overflowActions = [...actionProps, ...overflowActions];
    actionProps = [];
  }

  if (overflowActions.length > 0) {
    overflowMenu = (
      <PureActionMenu
        actions={overflowActions}
        anchor={overflowMenuAnchor}
        onClose={handleCloseOverflowMenu}
      />
    );
    actionProps.push({
      'aria-label': 'open actions menu',
      icon: <MoreVertIcon />,
      onClick: handleOpenOverflowMenu,
      text: 'Open actions menu',
    });
  }

  return (
    <>
      <PureAppBar actions={actionProps} navAction={navActionProps} title={appBarTitle} />
      {overflowMenu}
      <PureDrawer
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
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
  back: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
  ]),
  primaryActions: actionPropsType,
  secondaryActions: actionPropsType,
  selectionActions: actionPropsType,
  title: PropTypes.string,
};

FullAppBar.defaultProps = {
  back: null,
  primaryActions: null,
  secondaryActions: null,
  selectionActions: null,
  title: undefined,
};

export default FullAppBar;
