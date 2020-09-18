import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryCacheProvider, ReactQueryConfigProvider, makeQueryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import { EnvelopeContextProvider } from '../../contexts/envelope';
import EnvelopesListPage from './EnvelopesListPage';

const queryCache = makeQueryCache();
const queryConfig = { retry: false };

export default {
  title: 'envelopes/EnvelopesListPage',
  component: EnvelopesListPage,
  decorators: [
    (story) => <EnvelopeContextProvider>{story()}</EnvelopeContextProvider>,
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => <ReactQueryCacheProvider queryCache={queryCache}>{story()}</ReactQueryCacheProvider>,
    (story) => <ReactQueryConfigProvider config={queryConfig}>{story()}</ReactQueryConfigProvider>,
    (story) => {
      setSelectedLedger('ledger-id');
      return story();
    },
    (story) => {
      const mock = new MockAdapter(axios, { delayResponse: 1000 });
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
      return story();
    },
  ],
};

export const Desktop = () => <EnvelopesListPage />;

export const Mobile = () => <EnvelopesListPage />;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
