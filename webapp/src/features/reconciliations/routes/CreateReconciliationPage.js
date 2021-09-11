import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import React from 'react';
import { useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';
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

  return (
    <FullAppPage back={parentRoute} title='Create Reconciliation'>
      <div className={classes.content}>
        <Formik
          initialValues={ReconciliationForm.initialValues}
          validate={ReconciliationForm.validate}
          validationSchema={ReconciliationForm.validationSchema}
        >
          <ReconciliationForm accountId={accountId} />
        </Formik>
      </div>
    </FullAppPage>
  );
};

export default CreateReconciliationPage;
