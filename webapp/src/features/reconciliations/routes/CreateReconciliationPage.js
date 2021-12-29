import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import AppPage from 'common/components/AppPage';
import * as routes from 'common/utils/routes';
import { CreateTransactionDialog } from 'features/transactions';
import CreateReconciliationAppBar from '../components/CreateReconciliationAppBar';
import CreateReconciliationForm from '../components/CreateReconciliationForm';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
  },
}));

const CreateReconciliationPage = () => {
  const classes = useStyles();
  const location = useLocation();

  const { id } = useParams();
  const { from: parentRoute } = location.state || { from: { pathname: routes.accountRoute(id) } };
  const accountId = parseInt(id, 10);

  const [createTrnIsOpen, setCreateTrnIsOpen] = React.useState(false);
  const handleOpenCreateTrn = () => setCreateTrnIsOpen(true);
  const handleCloseCreateTrn = () => setCreateTrnIsOpen(false);

  return (
    <AppPage
      appBar={
        <CreateReconciliationAppBar
          onCreateTransaction={handleOpenCreateTrn}
          parentRoute={parentRoute}
        />
      }
    >
      <div className={classes.content}>
        <CreateReconciliationForm accountId={accountId} parentRoute={parentRoute} />
      </div>
      {createTrnIsOpen && (
        <CreateTransactionDialog initialAccountId={accountId} onExit={handleCloseCreateTrn} />
      )}
    </AppPage>
  );
};

export default CreateReconciliationPage;
