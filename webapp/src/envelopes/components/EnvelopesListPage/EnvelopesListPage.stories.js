import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import EnvelopesListPage from './EnvelopesListPage';

const createEnvelope = (catId, envId) => ({
  id: catId * 100 + envId,
  name: `Envelope ${catId}.${envId}`,
});

const createCategory = (numEnvs, catId) => ({
  id: catId,
  name: `Category ${catId}`,
  envelopes: [...Array(numEnvs)].map((_, i) => createEnvelope(catId, i)),
});

export default {
  title: 'envelopes/EnvelopesListPage',
  component: EnvelopesListPage,
  decorators: [
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
    (story, { parameters }) => {
      const {
        categories = [],
        delayResponse = 1000,
        deleteCode = 204,
        getAllCode = 200,
        getOneCode = 200,
        postCode = 201,
        putCode = 200,
      } = parameters;

      const mockAxios = new MockAdapter(axios, { delayResponse });

      // Categories
      mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(getAllCode, {
        categories: categories.map((num, i) => createCategory(num, i + 1)),
      });
      mockAxios.onPost('/api/ledgers/2/envelope-categories').reply(postCode);

      mockAxios.onGet(/\/api\/envelope-categories\/\d+/).reply((conf) => {
        const [id] = conf.url.match(/\d+/);
        return [getOneCode, createCategory(0, id)];
      });
      mockAxios.onDelete(/\/api\/envelope-categories\/\d+/).reply(deleteCode);
      mockAxios.onPut(/\/api\/envelope-categories\/\d+/).reply(putCode);

      // Envelopes
      mockAxios.onPost(/\/api\/envelope-categories\/\d+\/envelopes/).reply(postCode);
      mockAxios.onGet(/\/api\/envelopes\/\d+/).reply((conf) => {
        const [id] = conf.url.match(/\d+/);
        const acctId = id % 100;
        const catId = (id - acctId) / 100;
        return [getOneCode, createEnvelope(catId, acctId)];
      });
      mockAxios.onDelete(/\/api\/envelopes\/\d+/).reply(deleteCode);
      mockAxios.onPut(/\/api\/envelopes\/\d+/).reply(putCode);

      return story();
    },
  ],
};

const Template = () => <EnvelopesListPage />;

export const NoEnvelopes = Template.bind({});

export const GetError = Template.bind({});
GetError.parameters = {
  getAllCode: 500,
};

export const FewCategories = Template.bind({});
FewCategories.parameters = {
  categories: [1, 1, 2],
};

export const ManyEnvelopes = Template.bind({});
ManyEnvelopes.parameters = {
  categories: [3, 8, 5, 16],
};

export const ManyEnvelopesOnMobile = Template.bind({});
ManyEnvelopesOnMobile.parameters = {
  ...ManyEnvelopes.parameters,
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
