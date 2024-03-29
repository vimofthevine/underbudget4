import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import AccountsList from '../components/AccountsList';
import CreateAccountCategoryDialog from '../components/CreateAccountCategoryDialog';
import CreateAccountDialog from '../components/CreateAccountDialog';
import ModifyAccountCategoryDialog from '../components/ModifyAccountCategoryDialog';

const AccountsListPage = () => {
  const navigate = useNavigateKeepingSearch();

  const actions = [
    {
      'aria-label': 'Create account',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create'),
      text: 'Create account',
    },
    {
      'aria-label': 'Create account category',
      icon: <CreateNewFolderIcon />,
      onClick: () => navigate('create-category'),
      text: 'Create category',
    },
  ];

  return (
    <FullAppPage primaryActions={actions} title='Accounts'>
      <AccountsList />
      <Routes>
        <Route path='create-category' element={<CreateAccountCategoryDialog />} />
        <Route path='modify-category/:id' element={<ModifyAccountCategoryDialog />} />
        <Route path='create' element={<CreateAccountDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default AccountsListPage;
