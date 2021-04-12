export const DASHBOARD = '/';
export const LEDGERS = '/ledgers';
export const ACCOUNTS = '/accounts';
export const ENVELOPES = '/envelopes';
export const INCOMES = '/incomes';
export const EXPENSES = '/expenses';
export const REPORTS = '/reports';

export const accountRoute = (id) => `${ACCOUNTS}/${id}`;
export const envelopeRoute = (id) => `${ENVELOPES}/${id}`;
