import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FullAppPage from '../../../common/components/FullAppPage';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import AccountsList from '../AccountsList';
import CreateAccountCategoryDialog from '../CreateAccountCategoryDialog';
import CreateAccountDialog from '../CreateAccountDialog';
import ModifyAccountCategoryDialog from '../ModifyAccountCategoryDialog';
import ModifyAccountDialog from '../ModifyAccountDialog';

const AccountsListPage = () => {
  const navigate = useNavigateKeepingSearch();

  const actions = [
    {
      'aria-label': 'Create account',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create'),
      text: 'Create category',
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
        <Route path='modify/:id' element={<ModifyAccountDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default AccountsListPage;
