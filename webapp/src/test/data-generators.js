import * as faker from 'faker';
import moment from 'moment';

// eslint-disable-next-line import/prefer-default-export
export const transactionGenerator = (overrides = {}) => {
  let { amount } = overrides;
  if (amount === undefined) {
    amount = faker.datatype.number({ min: -100000, max: 100000 });
  }
  return {
    id: faker.datatype.number({ min: 1 }),
    transactionId: faker.datatype.number({ min: 1 }),
    recordedDate: moment(faker.date.past(1)).format('YYYY-MM-DD'),
    payee: faker.company.companyName(),
    type: amount < 0 ? 'expense' : 'income',
    memo: faker.commerce.product(),
    cleared: faker.datatype.boolean(),
    amount,
    balance: faker.datatype.number({ min: 100000, max: 400000 }),
    ...overrides,
  };
};
