import AddCircleIcon from '@material-ui/icons/AddCircle';
import PropTypes from 'prop-types';
import React from 'react';

import { ActionPageAppBar, RightIconButtons } from 'common/components/AppBar';
import routePropType from 'common/utils/route-prop-type';

const CreateReconciliationAppBar = ({ onCreateTransaction, parentRoute }) => (
  <ActionPageAppBar
    back={parentRoute}
    rightButtons={
      <RightIconButtons
        primaryActions={{
          'aria-label': 'Create transaction',
          icon: <AddCircleIcon />,
          onClick: onCreateTransaction,
          text: 'Create transaction',
        }}
      />
    }
    title='Create Reconciliation'
  />
);

CreateReconciliationAppBar.propTypes = {
  onCreateTransaction: PropTypes.func.isRequired,
  parentRoute: routePropType.isRequired,
};

export default CreateReconciliationAppBar;
