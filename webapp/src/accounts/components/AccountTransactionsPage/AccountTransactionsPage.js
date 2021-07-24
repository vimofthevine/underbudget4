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
import CreateTransactionDialog from 'transactions/components/CreateTransactionDialog';
import ModifyTransactionDialog from 'transactions/components/ModifyTransactionDialog';
import TransactionDetailsDialog from 'transactions/components/TransactionDetailsDialog';
import TransactionHistory from 'transactions/components/TransactionHistory';
import useFetchAccountTransactions from 'transactions/hooks/useFetchAccountTransactions';
import useDeleteAccount from '../../hooks/useDeleteAccount';
import useFetchAccount from '../../hooks/useFetchAccount';
import useFetchAccountBalance from '../../hooks/useFetchAccountBalance';
import ModifyAccountDialog from '../ModifyAccountDialog';

const parentRoute = { pathname: routes.ACCOUNTS, search: '' };

const AccountTransactionsPage = () => {
  const confirm = useConfirmation();
  const formatMoney = useFormatMoney();
  const mobile = useMobile();
  const navigate = useNavigateKeepingSearch();

  const { mutate: deleteAccount } = useDeleteAccount({
    onSuccess: () => navigate(parentRoute),
  });

  const { id } = useParams();
  const { data } = useFetchAccount({ id });
  const { data: balanceData } = useFetchAccountBalance({ id });

  const handleDelete = React.useCallback(
    () =>
      confirm({
        message: [
          `Delete account ${data && data.name}?`,
          'This action is permanent and cannot be undone.',
        ],
      }).then(() => {
        deleteAccount(id);
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
      'aria-label': 'Modify account',
      icon: <EditIcon />,
      onClick: () => navigate('modify'),
      text: 'Modify',
    },
  ];

  const secondaryActions = [
    {
      'aria-label': 'Delete account',
      disabled: balanceData && balanceData.total > 0,
      icon: <DeleteIcon />,
      onClick: handleDelete,
      text: 'Delete',
    },
    {
      'aria-label': 'Archive account',
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
      <TransactionHistory hasCleared useFetchTransactions={useFetchAccountTransactions} />
      <Routes>
        <Route path='modify' element={<ModifyAccountDialog />} />
        <Route
          path='create-transaction'
          element={<CreateTransactionDialog initialAccountId={parseInt(id, 10)} />}
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

export default AccountTransactionsPage;
