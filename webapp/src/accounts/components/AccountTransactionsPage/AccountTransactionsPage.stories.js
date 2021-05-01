import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import * as TransactionStories from '../../../transactions/components/FullTransactionsTable/FullTransactionsTable.stories';
import AccountTransactionsPage from './AccountTransactionsPage';

export default {
  title: 'accounts/AccountTransactionsPage',
  component: AccountTransactionsPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='account/:id/*' element={story()} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story, { parameters }) => {
      const { currency = 840, delayResponse = 1000 } = parameters;

      setSelectedLedger('2');

      const mockAxios = new MockAdapter(axios, { delayResponse });

      // Ledger
      mockAxios.onGet('/api/ledgers/2').reply(200, { currency });

      // Account
      mockAxios.onGet('/api/accounts/3').reply(200, {
        name: 'Bank Account',
      });
      mockAxios.onGet('/api/accounts/3/balance').reply(200, {
        balance: 51244,
      });

      // Transactions
      mockAxios.onGet(/\/api\/accounts\/3\/transactions.*/).reply(200, {
        transactions: TransactionStories.ManyTransactions.args.transactions,
        page: 1,
        size: 25,
        total: 12,
      });
      mockAxios.onGet(/\/api\/transactions\/\d+/).reply(200, {
        accountTransactions: [{ id: 2, accountId: 2, memo: '', amount: -1450 }],
        envelopeTransactions: [{ id: 5, envelopeId: 2, memo: '', amount: -1450 }],
      });

      return story();
    },
  ],
  parameters: {
    initialRoute: '/account/3',
  },
};

const Template = () => <AccountTransactionsPage />;

export const Full = Template.bind({});

export const Mobile = Template.bind({});
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
