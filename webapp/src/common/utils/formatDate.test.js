import moment from 'moment';

import formatDate from './formatDate';

test('should format unix timestamps', () => {
  expect(formatDate(1609486201000)).toBe('2021-01-01');
});

test('should format date strings', () => {
  expect(formatDate('2021-01-01')).toBe('2021-01-01');
  expect(formatDate('2021-01-01T07:30:01')).toBe('2021-01-01');
  expect(formatDate('2021-01-32')).toBe('Invalid date');
});

test('should format date objects', () => {
  expect(formatDate(new Date(2021, 0, 1))).toBe('2021-01-01');
  expect(formatDate(new Date(2021, 0, 1, 7, 30, 1))).toBe('2021-01-01');
  expect(formatDate(new Date(2021, 0, 32))).toBe('2021-02-01');
});

test('should format moment objects', () => {
  expect(formatDate(moment({ year: 2021, month: 0, day: 1 }))).toBe('2021-01-01');
  expect(formatDate(moment({ year: 2021, month: 0, day: 1, hour: 7, minute: 30, second: 1 }))).toBe(
    '2021-01-01',
  );
  expect(
    formatDate(moment({ year: 2021, month: 0, day: 32, hour: 7, minute: 30, second: 1 })),
  ).toBe('Invalid date');
});
