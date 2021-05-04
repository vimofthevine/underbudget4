import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import FullAppPage from '../../../common/components/FullAppPage';
import useMobile from '../../../common/hooks/useMobile';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFormatMoney from '../../../ledgers/hooks/useFormatMoney';
import TransactionHistory from '../../../transactions/components/TransactionHistory';
import useFetchAccountTransactions from '../../../transactions/hooks/useFetchAccountTransactions';
import useFetchAccount from '../../hooks/useFetchAccount';
import useFetchAccountBalance from '../../hooks/useFetchAccountBalance';
import ModifyAccountDialog from '../ModifyAccountDialog';

const AccountTransactionsPage = () => {
  const mobile = useMobile();
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data } = useFetchAccount({ id });
  const { data: balanceData } = useFetchAccountBalance({ id });

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
      icon: <DeleteIcon />,
      onClick: () => navigate('delete'),
      text: 'Delete',
    },
    {
      'aria-label': 'Archive account',
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
    <FullAppPage primaryActions={primaryActions} secondaryActions={secondaryActions} title={title}>
      <TransactionHistory hasCleared useFetchTransactions={useFetchAccountTransactions} />
      <Routes>
        <Route path='modify' element={<ModifyAccountDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default AccountTransactionsPage;
