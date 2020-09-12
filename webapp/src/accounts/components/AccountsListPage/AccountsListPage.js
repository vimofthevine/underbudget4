import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React from 'react';

import FullAppPage from '../../../common/components/FullAppPage';
import useCreateAccount from '../../hooks/useCreateAccount';
import useCreateAccountCategory from '../../hooks/useCreateAccountCategory';
import AccountsList from '../AccountsList';
import CreateAccountCategoryDialog from '../CreateAccountCategoryDialog';
import ModifyAccountCategoryDialog from '../ModifyAccountCategoryDialog';

const AccountsListPage = () => {
  const actions = [
    {
      'aria-label': 'Create account',
      icon: <AddCircleIcon />,
      onClick: useCreateAccount(),
      text: 'Create category',
    },
    {
      'aria-label': 'Create account category',
      icon: <CreateNewFolderIcon />,
      onClick: useCreateAccountCategory(),
      text: 'Create category',
    },
  ];

  return (
    <FullAppPage primaryActions={actions} title='Accounts'>
      <AccountsList />
      <CreateAccountCategoryDialog />
      <ModifyAccountCategoryDialog />
    </FullAppPage>
  );
};

export default AccountsListPage;
