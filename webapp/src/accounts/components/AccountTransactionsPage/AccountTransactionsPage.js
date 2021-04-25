import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
// import { Routes, Route } from 'react-router-dom';

import FullAppPage from '../../../common/components/FullAppPage';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';

const AccountTransactionsPage = () => {
  const navigate = useNavigateKeepingSearch();

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

  return (
    <FullAppPage
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
      title='Account'
    >
      <div>account transactions</div>
    </FullAppPage>
  );
};

export default AccountTransactionsPage;
