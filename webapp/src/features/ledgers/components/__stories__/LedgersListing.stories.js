import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';

import AppProviders from 'common/components/AppProviders';
import LedgersListing from '../LedgersListing';

export default {
  title: 'ledgers/LedgersListing',
  component: LedgersListing,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <AppProviders>{story()}</AppProviders>,
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
    ledgers: createLedgers(5),
    total: 5,
  });
  return <LedgersListing />;
};

export const ManyLedgers = (_, { mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply(200, {
    ledgers: createLedgers(10),
    total: 42,
  });
  return <LedgersListing />;
};

export const FetchError = (_, { mock }) => {
  mock.onGet(/\/api\/ledgers.*/).timeout();
  return <LedgersListing />;
};
