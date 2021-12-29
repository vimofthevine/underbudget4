import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import useNavigateToCreateReconciliation from '../hooks/useNavigateToCreateReconciliation';

const NoReconciliationsAlert = ({ accountId }) => {
  const handleCreateReconciliation = useNavigateToCreateReconciliation(accountId);

  return (
    <Alert action={<Button onClick={handleCreateReconciliation}>Create</Button>} severity='info'>
      No reconciliations exist yet
    </Alert>
  );
};

NoReconciliationsAlert.propTypes = {
  accountId: PropTypes.number.isRequired,
};

export default NoReconciliationsAlert;
