import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useNavigate } from 'react-router';

import useFormatMoney from 'common/hooks/useFormatMoney';
import { accountRoute } from 'common/utils/routes';
import useFetchAccountBalance from '../hooks/useFetchAccountBalance';
import AccountPropTypes from '../utils/account-prop-types';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const AccountListItem = ({ account }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = () => navigate(accountRoute(account.id));
  const formatMoney = useFormatMoney();
  const { data, isLoading } = useFetchAccountBalance({ id: account.id });

  const balance = React.useMemo(() => {
    if (isLoading) {
      return '...';
    }
    if (data) {
      return formatMoney(data.balance);
    }
    return '';
  }, [data, isLoading, formatMoney]);

  return (
    <ListItem button className={classes.item} onClick={handleClick}>
      <ListItemText inset primary={account.name} secondary={balance} />
    </ListItem>
  );
};

AccountListItem.propTypes = {
  account: AccountPropTypes.isRequired,
};

export default AccountListItem;
