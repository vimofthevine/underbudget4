import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import React from 'react';
import { useParams, usePrompt } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';
import { CreateTransactionDialog } from 'features/transactions';
import ReconciliationForm from '../components/ReconciliationForm';
import useCreateReconciliation from '../hooks/useCreateReconciliation';

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

  const [submitted, setSubmitted] = React.useState(false);
  usePrompt('You have unsaved changes. Are you sure you wish to leave?', !submitted);

  const navigate = useNavigateKeepingSearch();
  React.useEffect(() => {
    if (submitted) {
      navigate(parentRoute);
    }
  }, [submitted]);

  const { mutate } = useCreateReconciliation({ accountId });
  const handleSubmit = (values) => mutate(values, { onSuccess: () => setSubmitted(true) });

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
          onSubmit={handleSubmit}
          validate={ReconciliationForm.validate}
          validationSchema={ReconciliationForm.validationSchema}
        >
          <Form>
            <ReconciliationForm accountId={accountId} />
          </Form>
        </Formik>
      </div>
      {createTrnIsOpen && (
        <CreateTransactionDialog initialAccountId={accountId} onExit={handleCloseCreateTrn} />
      )}
    </FullAppPage>
  );
};

export default CreateReconciliationPage;
