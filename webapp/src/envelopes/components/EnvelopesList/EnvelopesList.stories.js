import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import { EnvelopeContextProvider } from '../../contexts/envelope';
import EnvelopesList from './EnvelopesList';

export default {
  title: 'envelopes/EnvelopesList',
  component: EnvelopesList,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <EnvelopeContextProvider>{story()}</EnvelopeContextProvider>,
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('ledger-id');
      return story();
    },
  ],
};

export const FetchError = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/envelopeCategories?projection=categoryWithEnvelopes')
    .reply(500);
  return <EnvelopesList />;
};

export const NoEnvelopes = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/envelopeCategories?projection=categoryWithEnvelopes')
    .reply(200, {
      _embedded: { envelopeCategories: [] },
    });
  return <EnvelopesList />;
};

export const FewCategories = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/envelopeCategories?projection=categoryWithEnvelopes')
    .reply(200, {
      _embedded: {
        envelopeCategories: [
          {
            id: 'cat-id-2',
            name: 'Category 2',
            envelopes: [{ id: 'env-id-3', name: 'Envelope 2.1' }],
          },
          {
            id: 'cat-id-3',
            name: 'Category 3',
            envelopes: [{ id: 'env-id-4', name: 'Envelope 3.1' }],
          },
          {
            id: 'cat-id-1',
            name: 'Category 1',
            envelopes: [
              { id: 'env-id-2', name: 'Envelope 1.2' },
              { id: 'env-id-1', name: 'Envelope 1.1' },
            ],
          },
        ],
      },
    });
  return <EnvelopesList />;
};

const createEnvelope = (catId, envId) => ({
  id: `envelope-id-${catId}-${envId}`,
  name: `Envelope ${envId}`,
});

const createCategory = (catId, numEnvs) => ({
  id: `cat-id-${catId}`,
  name: `Category ${catId}`,
  envelopes: [...Array(numEnvs)].map((_, i) => createEnvelope(catId, i)),
});

export const ManyEnvelopes = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/envelopeCategories?projection=categoryWithEnvelopes')
    .reply(200, {
      _embedded: {
        envelopeCategories: [
          createCategory(1, 3),
          createCategory(2, 8),
          createCategory(3, 5),
          createCategory(4, 16),
        ],
      },
    });
  return <EnvelopesList />;
};
