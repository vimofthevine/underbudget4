/* eslint-disable react/jsx-props-no-spreading */

import { green, red, purple } from '@material-ui/core/colors';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import React from 'react';

export const IncomeIcon = (props) => <ArrowUpwardIcon style={{ color: green[500] }} {...props} />;

export const ExportIcon = (props) => <ArrowDownwardIcon style={{ color: red[500] }} {...props} />;

export const TransferIcon = (props) => <SwapHorizIcon style={{ color: purple[500] }} {...props} />;

export const AllocationIcon = (props) => (
  <SwapHorizIcon style={{ color: purple[500] }} {...props} />
);
