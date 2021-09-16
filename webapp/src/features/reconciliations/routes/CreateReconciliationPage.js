import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import React from 'react';
import { useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';
import { CreateTransactionDialog } from 'features/transactions';
import ReconciliationForm from '../components/ReconciliationForm';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
  },
}));

const CreateReconciliationPage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const parentRoute = React.useMemo(() => ({ pathname: `${routes.ACCOUNT}/${id}`, search: '' }), [
    id,
  ]);
  const accountId = parseInt(id, 10);

  const [createTrnIsOpen, setCreateTrnIsOpen] = React.useState(false);
  const handleCloseCreateTrn = () => setCreateTrnIsOpen(false);
  const primaryActions = [
    {
      'aria-label': 'Create transaction',
      icon: <AddCircleIcon />,
      onClick: () => setCreateTrnIsOpen(true),
      text: 'Create transaction',
    },
  ];

  return (
    <FullAppPage back={parentRoute} primaryActions={primaryActions} title='Create Reconciliation'>
      <div className={classes.content}>
        <Formik
          initialValues={ReconciliationForm.initialValues}
          validate={ReconciliationForm.validate}
          validationSchema={ReconciliationForm.validationSchema}
        >
          <ReconciliationForm accountId={accountId} />
        </Formik>
      </div>
      {createTrnIsOpen && (
        <CreateTransactionDialog initialAccountId={accountId} onExit={handleCloseCreateTrn} />
      )}
    </FullAppPage>
  );
};

export default CreateReconciliationPage;
