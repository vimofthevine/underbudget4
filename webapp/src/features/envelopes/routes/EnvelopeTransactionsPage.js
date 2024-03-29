import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useConfirmation from 'common/hooks/useConfirmation';
import useFormatMoney from 'common/hooks/useFormatMoney';
import useMobile from 'common/hooks/useMobile';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';
import {
  CreateTransactionDialog,
  ModifyTransactionDialog,
  TransactionDetailsDialog,
  TransactionHistory,
  useFetchEnvelopeTransactions,
} from 'features/transactions';
import ModifyEnvelopeDialog from '../components/ModifyEnvelopeDialog';
import useDeleteEnvelope from '../hooks/useDeleteEnvelope';
import useFetchEnvelope from '../hooks/useFetchEnvelope';
import useFetchEnvelopeBalance from '../hooks/useFetchEnvelopeBalance';

const parentRoute = { pathname: routes.ENVELOPES, search: '' };

const EnvelopeTransactionsPage = () => {
  const confirm = useConfirmation();
  const formatMoney = useFormatMoney();
  const mobile = useMobile();
  const navigate = useNavigateKeepingSearch();

  const { mutate: deleteEnvelope } = useDeleteEnvelope({
    onSuccess: () => navigate(parentRoute),
  });

  const { id } = useParams();
  const { data } = useFetchEnvelope({ id });
  const { data: balanceData } = useFetchEnvelopeBalance({ id });

  const handleDelete = React.useCallback(
    () =>
      confirm({
        message: [
          `Delete envelope ${data && data.name}?`,
          'This action is permanent and cannot be undone.',
        ],
      }).then(() => {
        deleteEnvelope(id);
      }),
    [data, id],
  );

  const primaryActions = [
    {
      'aria-label': 'Create transaction',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create-transaction'),
      text: 'Create transaction',
    },
    {
      'aria-label': 'Modify envelope',
      icon: <EditIcon />,
      onClick: () => navigate('modify'),
      text: 'Modify',
    },
  ];

  const secondaryActions = [
    {
      'aria-label': 'Delete envelope',
      disabled: balanceData && balanceData.total > 0,
      icon: <DeleteIcon />,
      onClick: handleDelete,
      text: 'Delete',
    },
    {
      'aria-label': 'Archive envelope',
      disabled: true,
      icon: <ArchiveIcon />,
      onClick: () => navigate('archive'),
      text: 'Archive',
    },
  ];

  const title = React.useMemo(() => {
    if (!data) {
      return '...';
    }
    if (mobile || !balanceData) {
      return data.name;
    }
    return `${data.name} | ${formatMoney(balanceData.balance)}`;
  }, [data, balanceData, mobile]);

  return (
    <FullAppPage
      back={parentRoute}
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
      title={title}
    >
      <TransactionHistory useFetchTransactions={useFetchEnvelopeTransactions} />
      <Routes>
        <Route path='modify' element={<ModifyEnvelopeDialog />} />
        <Route
          path='create-transaction'
          element={<CreateTransactionDialog initialEnvelopeId={parseInt(id, 10)} />}
        />
        <Route
          path='modify-transaction/:transactionId/*'
          element={<ModifyTransactionDialog onExitNavigateTo='../..' />}
        />
        <Route
          path='transaction/:transactionId/*'
          element={<TransactionDetailsDialog onExitNavigateTo='../..' />}
        />
      </Routes>
    </FullAppPage>
  );
};

export default EnvelopeTransactionsPage;
