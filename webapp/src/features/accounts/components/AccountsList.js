import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import useAccounts from '../hooks/useAccounts';
import AccountCategoryListItem from './AccountCategoryListItem';

const AccountsList = () => {
  const { categories, error, status } = useAccounts();

  return (
    <>
      {status === 'success' && (
        <List dense disablePadding>
          {categories.map((cat) => (
            <AccountCategoryListItem category={cat} key={cat.id} />
          ))}
        </List>
      )}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

export default AccountsList;
