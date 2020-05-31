/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, queryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { ConfirmationServiceProvider } from '../../common/ConfirmationService';
import { SnackbarServiceProvider } from '../../common/SnackbarService';
import { LedgersContextProvider } from '../LedgersContext';
import LedgersListing from './LedgersListing';

const queryConfig = { retry: false };

export default {
  title: 'ledgers/LedgersListing',
  component: LedgersListing,
  decorators: [
    (story) => {
      queryCache.clear();
      return story();
    },
    (story) => <LedgersContextProvider>{story()}</LedgersContextProvider>,
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <ConfirmationServiceProvider>{story()}</ConfirmationServiceProvider>,
    (story) => <SnackbarServiceProvider>{story()}</SnackbarServiceProvider>,
    (story) => <ReactQueryConfigProvider config={queryConfig}>{story()}</ReactQueryConfigProvider>,
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

export const FewLedgers = ({ mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply(200, {
    _embedded: { ledgers: createLedgers(5) },
    page: { totalElements: 5 },
  });
  return <LedgersListing />;
};

export const ManyLedgers = ({ mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply(200, {
    _embedded: { ledgers: createLedgers(10) },
    page: { totalElements: 42 },
  });
  return <LedgersListing />;
};

export const FetchError = ({ mock }) => {
  mock.onGet(/\/api\/ledgers.*/).timeout();
  return <LedgersListing />;
};
