import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const accountCategories = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      accounts: [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      accounts: [],
    },
    {
      id: 3,
      name: 'Category 3',
      accounts: [
        { id: 3, name: 'Account 3' },
        { id: 4, name: 'Account 4' },
      ],
    },
  ],
};
const envelopeCategories = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      envelopes: [{ id: 1, name: 'Envelope 1' }],
    },
    {
      id: 2,
      name: 'Category 2',
      envelopes: [
        { id: 2, name: 'Envelope 2' },
        { id: 3, name: 'Envelope 3' },
        { id: 4, name: 'Envelope 4' },
      ],
    },
    {
      id: 3,
      name: 'Category 3',
      envelopes: [],
    },
  ],
};

export default ({
  currency = 840,
  delayResponse = 1000,
  getAccountCategoriesCode = 200,
  getEnvelopeCategoriesCode = 200,
  getLedgerCode = 200,
  ledgerId = 2,
} = {}) => {
  const mockAxios = new MockAdapter(axios, { delayResponse });

  mockAxios.onGet(`/api/ledgers/${ledgerId}`).reply(getLedgerCode, { currency });
  mockAxios
    .onGet(`/api/ledgers/${ledgerId}/account-categories`)
    .reply(getAccountCategoriesCode, accountCategories);
  mockAxios
    .onGet(`/api/ledgers/${ledgerId}/envelope-categories`)
    .reply(getEnvelopeCategoriesCode, envelopeCategories);

  return mockAxios;
};
