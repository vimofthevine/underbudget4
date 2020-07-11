export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const TOKENS = '/tokens';

export const DASHBOARD = '/';
export const LEDGERS = '/ledgers';
export const ACCOUNTS = '/accounts';
export const ACCOUNT_CATEGORIES = '/account-categories';
export const ENVELOPES = '/envelopes';
export const INCOMES = '/incomes';
export const EXPENSES = '/expenses';
export const REPORTS = '/reports';

export const accountRoute = (id) => `${ACCOUNTS}/${id}`;
