import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import React from 'react';

import useAccountName from '../../../accounts/hooks/useAccountName';
import useEnvelopeName from '../../../envelopes/hooks/useEnvelopeName';
import useFetchTransaction from '../hooks/useFetchTransaction';

const TransactionDetailsTable = ({ formatMoney, id }) => {
  const { data, isLoading } = useFetchTransaction({ id });
  const accountName = useAccountName();
  const envelopeName = useEnvelopeName();

  if (isLoading) {
    return <CircularProgress style={{ margin: 'auto' }} />;
  }

  if (!data) {
    return <Typography variant='body1'>Unable to retrieve transaction details</Typography>;
  }

  return (
    <Table aria-label='transaction details' size='small'>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Memo</TableCell>
          <TableCell>Cleared</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.accountTransactions.length > 0 && (
          <TableRow>
            <TableCell colSpan={4} variant='head'>
              Accounts
            </TableCell>
          </TableRow>
        )}
        {data.accountTransactions.map((trn) => (
          <TableRow key={trn.id}>
            <TableCell>{accountName(trn.accountId)}</TableCell>
            <TableCell>{trn.memo}</TableCell>
            <TableCell padding='checkbox'>{trn.cleared && <CheckIcon />}</TableCell>
            <TableCell>{formatMoney(trn.amount)}</TableCell>
          </TableRow>
        ))}
        {data.envelopeTransactions.length > 0 && (
          <TableRow>
            <TableCell colSpan={4} variant='head'>
              Envelopes
            </TableCell>
          </TableRow>
        )}
        {data.envelopeTransactions.map((trn) => (
          <TableRow key={trn.id}>
            <TableCell>{envelopeName(trn.envelopeId)}</TableCell>
            <TableCell>{trn.memo}</TableCell>
            <TableCell />
            <TableCell>{formatMoney(trn.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

TransactionDetailsTable.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default TransactionDetailsTable;
