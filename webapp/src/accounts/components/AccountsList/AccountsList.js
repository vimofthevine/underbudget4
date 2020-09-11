import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import useMobile from '../../../common/hooks/useMobile';
import useAccounts from '../../hooks/useAccounts';
import AccountCategoryListItem from '../AccountCategoryListItem';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AccountsList = () => {
  const classes = useStyles();
  const mobile = useMobile();
  const { categories, error, status } = useAccounts();

  return (
    <>
      {status === 'success' && (
        <List className={classes.list} disablePadding>
          {categories.map((cat) => (
            <AccountCategoryListItem category={cat} dense={!mobile} key={cat.id} />
          ))}
        </List>
      )}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

export default AccountsList;
