/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, queryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { ConfirmationServiceProvider } from '../../common/ConfirmationService';
import { SnackbarServiceProvider } from '../../common/SnackbarService';
import LedgersPage from './LedgersPage';

const queryConfig = { retry: false };

export default {
  title: 'ledgers/LedgersPage',
  component: LedgersPage,
  decorators: [
    (story) => {
      queryCache.clear();
      return story();
    },
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <ConfirmationServiceProvider>{story()}</ConfirmationServiceProvider>,
    (story) => <SnackbarServiceProvider>{story()}</SnackbarServiceProvider>,
    (story) => <ReactQueryConfigProvider config={queryConfig}>{story()}</ReactQueryConfigProvider>,
  ],
};

const currencies = [840, 978, 980];

const createLedgers = (from, to) => {
  const ledgers = [];
  let i = from;
  while (i < to) {
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
    _embedded: { ledgers: createLedgers(0, 5) },
    page: { totalElements: 5 },
  });
  return <LedgersPage />;
};

export const ManyLedgers = ({ mock }) => {
  mock.onGet(/\/api\/ledgers.*/).reply((config) => {
    const params = config.url.match(/.*page=(\d+)&size=(\d+)/);
    const page = Number(params[1]);
    const size = Number(params[2]);
    return [
      200,
      {
        _embedded: { ledgers: createLedgers(page * size, Math.min((page + 1) * size, 42)) },
        page: { totalElements: 42 },
      },
    ];
  });
  return <LedgersPage />;
};

export const FetchError = ({ mock }) => {
  mock.onGet(/\/api\/ledgers.*/).timeout();
  return <LedgersPage />;
};
