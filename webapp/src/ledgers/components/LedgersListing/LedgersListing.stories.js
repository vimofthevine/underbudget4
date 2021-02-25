import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import AppProviders from '../../../common/components/AppProviders';
import { LedgersContextProvider } from '../LedgersContext';
import LedgersListing from './LedgersListing';

export default {
  title: 'ledgers/LedgersListing',
  component: LedgersListing,
  decorators: [
    (story) => <LedgersContextProvider>{story()}</LedgersContextProvider>,
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
      return <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>;
    },
  ],
};

const currencies = [840, 978, 980];

const createLedgers = (num) => {
  const ledgers = [];
  let i = 0;
  while (i < num) {
    ledgers.push({
      id: `ledger-id-${i}`,
      name: `Ledger ${i}`,
      currency: currencies[i % currencies.length],
      lastUpdated: moment()
        .subtract(i * 2 + 4, 'day')
        .toISOString(),
    });
    i += 1;
  }
  return ledgers;
};

export const FewLedgers = (_, { mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply(200, {
    _embedded: { ledgers: createLedgers(5) },
    page: { totalElements: 5 },
  });
  return <LedgersListing />;
};

export const ManyLedgers = (_, { mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply(200, {
    _embedded: { ledgers: createLedgers(10) },
    page: { totalElements: 42 },
  });
  return <LedgersListing />;
};

export const FetchError = (_, { mock }) => {
  mock.onGet(/\/api\/ledgers.*/).timeout();
  return <LedgersListing />;
};
