export const DASHBOARD = '/';
export const LEDGERS = '/ledgers';
export const ACCOUNT = '/account';
export const ACCOUNTS = '/accounts';
export const ENVELOPE = '/envelope';
export const ENVELOPES = '/envelopes';
export const INCOMES = '/incomes';
export const EXPENSES = '/expenses';
export const REPORTS = '/reports';
export const LOGOUT = '/authelia/logout';

export const accountRoute = (id) => `${ACCOUNT}/${id}`;
export const envelopeRoute = (id) => `${ENVELOPE}/${id}`;
