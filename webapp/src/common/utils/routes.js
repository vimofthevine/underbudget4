export const DASHBOARD = '/';
export const LEDGERS = '/ledgers';
export const ACCOUNT = '/account';
export const ACCOUNTS = '/accounts';
export const ENVELOPE = '/envelope';
export const ENVELOPES = '/envelopes';
export const BUDGET = '/budget';
export const BUDGETS = '/budgets';
export const REPORTS = '/reports';
export const LOGOUT = '/authelia/logout';

export const accountRoute = (id) => `/account/${id}`;
export const accountReconciliationsRoute = (id) => `/account/${id}/reconciliations`;
export const createReconciliationRoute = (id) => `/account/${id}/create-reconciliation`;
export const reconciliationRoute = (id) => `/reconciliation/${id}`;
export const envelopeRoute = (id) => `${ENVELOPE}/${id}`;
export const budgetRoute = (id) => `${BUDGET}/${id}`;
