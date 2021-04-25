import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import AccountsListPage from './AccountsListPage';

const createAccount = (catId, acctId) => ({
  id: catId * 100 + acctId,
  name: `Account ${catId}.${acctId}`,
});
const createCategory = (numAccts, catId) => ({
  id: catId,
  name: `Category ${catId}`,
  accounts: [...Array(numAccts)].map((_, i) => createAccount(catId, i)),
});

export default {
  title: 'accounts/AccountsListPage',
  component: AccountsListPage,
  decorators: [
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
    (story, { parameters } = {}) => {
      const {
        categories = [],
        currency = 840,
        delayResponse = 1000,
        deleteCode = 204,
        getAllCode = 200,
        getOneCode = 200,
        postCode = 201,
        putCode = 200,
      } = parameters;

      const mockAxios = new MockAdapter(axios, { delayResponse });

      // Ledger
      mockAxios.onGet('/api/ledgers/2').reply(getAllCode, { currency });

      // Categories
      mockAxios.onGet('/api/ledgers/2/account-categories').reply(getAllCode, {
        categories: categories.map((num, i) => createCategory(num, i + 1)),
      });
      mockAxios.onPost('/api/ledgers/2/account-categories').reply(postCode);

      mockAxios.onGet(/\/api\/account-categories\/\d+/).reply((conf) => {
        const [id] = conf.url.match(/\d+/);
        return [getOneCode, createCategory(0, id)];
      });
      mockAxios.onDelete(/\/api\/account-categories\/\d+/).reply(deleteCode);
      mockAxios.onPut(/\/api\/account-categories\/\d+/).reply(putCode);

      // Accounts
      mockAxios.onPost(/\/api\/account-categories\/\d+\/accounts/).reply(postCode);
      mockAxios.onGet(/\/api\/accounts\/\d+\/balance/).reply((conf) => {
        const [id] = conf.url.match(/\d+/);
        return [getAllCode, { balance: id * 1010 + 50 }];
      });
      mockAxios.onGet(/\/api\/accounts\/\d+/).reply((conf) => {
        const [id] = conf.url.match(/\d+/);
        const acctId = id % 100;
        const catId = (id - acctId) / 100;
        return [getOneCode, createAccount(catId, acctId)];
      });
      mockAxios.onDelete(/\/api\/accounts\/\d+/).reply(deleteCode);
      mockAxios.onPut(/\/api\/accounts\/\d+/).reply(putCode);

      return story();
    },
  ],
};

const Template = () => <AccountsListPage />;

export const NoAccounts = Template.bind({});

export const GetError = Template.bind({});
GetError.parameters = {
  getAllCode: 500,
};

export const FewCategories = Template.bind({});
FewCategories.parameters = {
  categories: [1, 1, 2],
};

export const EuroCurrency = Template.bind({});
EuroCurrency.parameters = {
  categories: [1, 1, 2],
  currency: 978,
};

export const ManyAccounts = Template.bind({});
ManyAccounts.parameters = {
  categories: [3, 8, 5, 16],
};

export const ManyAccountsOnMobile = Template.bind({});
ManyAccountsOnMobile.parameters = {
  ...ManyAccounts.parameters,
  viewport: { defaultViewport: 'mobile1' },
};

export const CreateRequestError = Template.bind({});
CreateRequestError.parameters = {
  ...FewCategories.parameters,
  postCode: 400,
};

export const ModifyGetError = Template.bind({});
ModifyGetError.parameters = {
  ...FewCategories.parameters,
  getOneCode: 404,
};

export const ModifyRequestError = Template.bind({});
ModifyRequestError.parameters = {
  ...FewCategories.parameters,
  putCode: 400,
};

export const DeleteRequestError = Template.bind({});
DeleteRequestError.parameters = {
  ...FewCategories.parameters,
  deleteCode: 400,
};
