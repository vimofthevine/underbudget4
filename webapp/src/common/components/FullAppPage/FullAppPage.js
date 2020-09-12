import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import useSelection from '../../hooks/useSelection';
import toList from '../../utils/to-list';
import FullAppBar from '../FullAppBar';
import PureAppPage from '../PureAppPage';
import PureFab from '../PureFab';

const FullAppPage = ({ children, primaryActions, selectionActions, title, useFab }) => {
  const mobile = useMobile();
  const { selected } = useSelection();
  const hasSelection = selected && selected.length > 0;

  const hasFab = useFab && mobile && Boolean(primaryActions);

  const primaryActionProps = toList(primaryActions);
  const fabAction = hasFab ? primaryActionProps.shift() : null;

  const appBar = (
    <FullAppBar
      primaryActions={primaryActionProps}
      selectionActions={selectionActions}
      title={title}
    />
  );

  return (
    <PureAppPage appBar={appBar} hasFab={hasFab}>
      {mobile && children}
      {!mobile && <Paper>{children}</Paper>}
      {fabAction && !hasSelection && <PureFab action={fabAction} />}
    </PureAppPage>
  );
};

FullAppPage.propTypes = {
  ...FullAppBar.propTypes,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  useFab: PropTypes.bool,
};

FullAppPage.defaultProps = {
  ...FullAppBar.defaultProps,
  useFab: false,
};

export default FullAppPage;
