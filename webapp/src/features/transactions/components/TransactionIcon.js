/* eslint-disable react/jsx-props-no-spreading */

import { green, red, purple } from '@material-ui/core/colors';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import PropTypes from 'prop-types';
import React from 'react';

import types, { testIfType } from '../utils/transaction-types';

const TransactionIcon = ({ type, ...props }) => {
  if (testIfType.isIncome(type)) {
    return <ArrowUpwardIcon style={{ color: green[500] }} {...props} />;
  }
  if (testIfType.isExpense(type)) {
    return <ArrowDownwardIcon style={{ color: red[500] }} {...props} />;
  }
  if (testIfType.isTransfer(type)) {
    return <SwapHorizIcon style={{ color: purple[500] }} {...props} />;
  }
  if (testIfType.isAllocation(type)) {
    return <SwapHorizIcon style={{ color: purple[500] }} {...props} />;
  }
  return null;
};

TransactionIcon.propTypes = {
  type: PropTypes.oneOf(types).isRequired,
};

export default TransactionIcon;
