import calculateNextReconciliationDates from './calculateNextReconciliationDates';

test('first of month is ending date', () => {
  expect(calculateNextReconciliationDates('2021-01-01')).toEqual({
    beginningDate: '2021-01-02',
    endingDate: '2021-02-01',
  });
  expect(calculateNextReconciliationDates('2021-12-01')).toEqual({
    beginningDate: '2021-12-02',
    endingDate: '2022-01-01',
  });
});

test('last of month is ending date', () => {
  expect(calculateNextReconciliationDates('2021-01-31')).toEqual({
    beginningDate: '2021-02-01',
    endingDate: '2021-02-28',
  });
  expect(calculateNextReconciliationDates('2021-02-28')).toEqual({
    beginningDate: '2021-03-01',
    endingDate: '2021-03-28',
  });
  expect(calculateNextReconciliationDates('2021-03-31')).toEqual({
    beginningDate: '2021-04-01',
    endingDate: '2021-04-30',
  });
});
