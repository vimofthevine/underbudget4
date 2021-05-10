import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import React from 'react';

import useAccountName from '../../../accounts/hooks/useAccountName';
import useEnvelopeName from '../../../envelopes/hooks/useEnvelopeName';
import useFormatMoney from '../../../ledgers/hooks/useFormatMoney';
import useFetchTransaction from '../../hooks/useFetchTransaction';

const TransactionDetailsList = ({ id }) => {
  const { data, isLoading } = useFetchTransaction({ id });
  const formatMoney = useFormatMoney();
  const accountName = useAccountName();
  const envelopeName = useEnvelopeName();

  if (isLoading) {
    return <LinearProgress />;
  }

  if (!data) {
    return <Typography variant='body1'>Unable to retrieve transaction details</Typography>;
  }

  return (
    <List dense>
      <ListItem>
        <ListItemText primary={data.payee} secondary={data.recordedDate} />
      </ListItem>
      <Divider />
      {data.accountTransactions.length > 0 && <ListSubheader>Accounts</ListSubheader>}
      {data.accountTransactions.map((trn) => (
        <ListItem key={trn.id}>
          {trn.cleared && (
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
          )}
          <ListItemText
            inset={!trn.cleared}
            primary={accountName(trn.accountId)}
            secondary={trn.memo}
          />
          <ListItemSecondaryAction>{formatMoney(trn.amount)}</ListItemSecondaryAction>
        </ListItem>
      ))}
      {data.envelopeTransactions.length > 0 && <ListSubheader>Envelopes</ListSubheader>}
      {data.envelopeTransactions.map((trn) => (
        <ListItem key={trn.id}>
          <ListItemText inset primary={envelopeName(trn.envelopeId)} secondary={trn.memo} />
          <ListItemSecondaryAction>{formatMoney(trn.amount)}</ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

TransactionDetailsList.propTypes = {
  id: PropTypes.number.isRequired,
};

export default TransactionDetailsList;
