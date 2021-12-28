import * as faker from 'faker';
import moment from 'moment';

export const reconciliationGenerator = (overrides = {}) => {
  const endingDate = moment(faker.date.past(1));
  const endingBalance = faker.datatype.number({ min: 100000, max: 400000 });
  const beginningDate = endingDate.subtract(1, 'month');
  const beginningBalance = endingBalance - faker.datatype.number({ min: -100000, max: 100000 });
  return {
    id: faker.datatype.number({ min: 1 }),
    beginningBalance,
    beginningDate,
    endingBalance,
    endingDate,
    ...overrides,
  };
};

export const reconciliationsGenerator = (num) => {
  let endingDate = moment(faker.date.past(1));
  let endingBalance = faker.datatype.number({ min: 200000, max: 500000 });
  const reconciliations = [];

  for (let i = 0; i < num; i += 1) {
    const beginningBalance = endingBalance - faker.datatype.number({ min: -100000, max: 100000 });
    const beginningDate = endingDate.clone().subtract(1, 'month').add(1, 'day');
    reconciliations.push({
      id: faker.datatype.number({ min: 1 }),
      beginningBalance,
      beginningDate,
      endingBalance,
      endingDate,
    });
    endingBalance = beginningBalance;
    endingDate = beginningDate.clone().subtract(1, 'day');
  }

  return reconciliations;
};

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
