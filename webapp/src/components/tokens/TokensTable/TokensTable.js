import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const TokensTable = ({ mobile, tokens }) => (
  <Table size={mobile ? 'small' : 'medium'}>
    <TableHead>
      <TableRow>
        <TableCell>Issued</TableCell>
        <TableCell>Device</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {tokens.map((token) => (
        <TableRow key={token._links.self.href}>
          <TableCell component='th' scope='row'>
            {moment(token.issued).fromNow()}
          </TableCell>
          <TableCell>{token.source}</TableCell>
          <TableCell>Delete</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

TokensTable.propTypes = {
  mobile: PropTypes.bool,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      issued: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      _links: PropTypes.shape({
        self: PropTypes.shape({
          href: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

TokensTable.defaultProps = {
  mobile: false,
};

export default TokensTable;
