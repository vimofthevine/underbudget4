import React from 'react';
import TransactionIcon from './TransactionIcon';

export default {
  title: 'transactions/TransactionIcon',
  component: TransactionIcon,
};

export const Income = () => <TransactionIcon type='income' />;

export const Expense = () => <TransactionIcon type='expense' />;

export const Transfer = () => <TransactionIcon type='transfer' />;

export const Allocation = () => <TransactionIcon type='allocation' />;
