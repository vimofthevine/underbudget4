import PropTypes from 'prop-types';
import React from 'react';

import AppPage from '../../../basics/components/AppPage';
import Fab from '../../../basics/components/Fab';
import toList from '../../../basics/utils/to-list';
import useMobile from '../../hooks/useMobile';
import useSelection from '../../hooks/useSelection';
import AuthenticatedAppBar from '../AuthenticatedAppBar';

const AuthenticatedAppPage = ({ children, primaryActions, selectionActions, title, useFab }) => {
  const mobile = useMobile();
  const { selected } = useSelection();
  const hasSelection = selected && selected.length > 0;

  const hasFab = useFab && mobile && primaryActions;

  const primaryActionProps = toList(primaryActions);
  const fabAction = hasFab ? primaryActionProps.shift() : null;

  const appBar = (
    <AuthenticatedAppBar
      primaryActions={primaryActionProps}
      selectionActions={selectionActions}
      title={title}
    />
  );

  return (
    <AppPage appBar={appBar} hasFab={hasFab}>
      {children}
      {fabAction && !hasSelection && <Fab action={fabAction} />}
    </AppPage>
  );
};

AuthenticatedAppPage.propTypes = {
  ...AuthenticatedAppBar.propTypes,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  useFab: PropTypes.bool,
};

AuthenticatedAppPage.defaultProps = {
  ...AuthenticatedAppBar.defaultProps,
  useFab: false,
};

export default AuthenticatedAppPage;
