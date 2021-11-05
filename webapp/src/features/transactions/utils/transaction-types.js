export default [
  'income',
  'refund',
  'opening_balance',
  'expense',
  'transfer',
  'allocation',
  'reallocation',
];

export const typesByGroup = {
  income: ['income', 'refund', 'opening_balance'],
  expense: ['expense'],
  transfer: ['transfer'],
  allocation: ['allocation', 'reallocation'],
};

export const testIfType = {
  isIncome: (type) => typesByGroup.income.includes(type),
  isExpense: (type) => typesByGroup.expense.includes(type),
  isTransfer: (type) => typesByGroup.transfer.includes(type),
  isAllocation: (type) => typesByGroup.allocation.includes(type),
};

export const typeLabels = {
  income: 'Income',
  refund: 'Refund',
  opening_balance: 'Opening balance/initial setup',
  expense: 'Expense',
  transfer: 'Account-to-account',
  allocation: 'Envelope-to-envelope (budgeted)',
  reallocation: 'Envelope-to-envelope (emergency)',
};
