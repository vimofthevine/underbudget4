import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import actionPropsShape from '../../utils/action-props';
import toList from '../../utils/to-list';
import PureActionMenu from '../PureActionMenu';

const RightIconButtons = ({ primaryActions, secondaryActions }) => {
  const [overflowMenuAnchor, setOverflowMenuAnchor] = React.useState(null);
  const handleOpenOverflowMenu = (e) => setOverflowMenuAnchor(e.currentTarget);
  const handleCloseOverflowMenu = () => setOverflowMenuAnchor(null);

  const mobile = useMobile();

  let visibleActions = toList(primaryActions);
  let overflowActions = toList(secondaryActions);
  let overflowMenu = null;

  // If we have to truncate, move all actions into overflow actions
  if (mobile) {
    let numVisible = visibleActions.length;
    if (overflowActions.length > 0) {
      numVisible += 1;
    }
    if (numVisible > 2) {
      overflowActions = [...visibleActions, ...overflowActions];
      visibleActions = [];
    }
  }

  if (overflowActions.length > 0) {
    overflowMenu = (
      <PureActionMenu
        actions={overflowActions}
        anchor={overflowMenuAnchor}
        onClose={handleCloseOverflowMenu}
      />
    );
    visibleActions.push({
      'aria-label': 'open actions menu',
      icon: <MoreVertIcon />,
      onClick: handleOpenOverflowMenu,
      text: 'Open actions menu',
    });
  }

  return (
    <>
      {visibleActions.map((action, idx) => (
        <Tooltip enterDelay={750} key={action.text} title={action.text}>
          <IconButton
            color='inherit'
            edge={idx === visibleActions.length - 1 ? 'end' : false}
            {...action}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
      {overflowMenu}
    </>
  );
};

const actionPropsType = PropTypes.oneOfType([
  actionPropsShape,
  PropTypes.arrayOf(actionPropsShape),
]);

RightIconButtons.propTypes = {
  primaryActions: actionPropsType,
  secondaryActions: actionPropsType,
};

RightIconButtons.defaultProps = {
  primaryActions: null,
  secondaryActions: null,
};

export default RightIconButtons;
