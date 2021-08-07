import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import PeriodSelect from './PeriodSelect';

test('should display weekly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={52} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Jan 8 to Jan 14' }));
  expect(screen.getAllByRole('option')).toHaveLength(52);

  userEvent.click(screen.getByRole('option', { name: 'Aug 6 to Aug 12' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(31);
});

test('should display biweekly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={26} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Jan 15 to Jan 28' }));
  expect(screen.getAllByRole('option')).toHaveLength(26);

  userEvent.click(screen.getByRole('option', { name: 'Jul 30 to Aug 12' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(15);
});

test('should display semimonthly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={24} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Jan 16 to Jan 31' }));
  expect(screen.getAllByRole('option')).toHaveLength(24);

  userEvent.click(screen.getByRole('option', { name: 'Jul 16 to Jul 31' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(13);
});

test('should display monthly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={12} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'February' }));
  expect(screen.getAllByRole('option')).toHaveLength(12);

  userEvent.click(screen.getByRole('option', { name: 'July' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(6);
});

test('should display bimonthly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={6} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Mar/Apr' }));
  expect(screen.getAllByRole('option')).toHaveLength(6);

  userEvent.click(screen.getByRole('option', { name: 'Jul/Aug' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(3);
});

test('should display quarterly period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={4} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Apr to Jun' }));
  expect(screen.getAllByRole('option')).toHaveLength(4);

  userEvent.click(screen.getByRole('option', { name: 'Oct to Dec' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(3);
});

test('should display triannual period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={3} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'May to Aug' }));
  expect(screen.getAllByRole('option')).toHaveLength(3);

  userEvent.click(screen.getByRole('option', { name: 'Sep to Dec' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(2);
});

test('should display biannual period options', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={2} value={1} />);

  userEvent.click(screen.getByRole('button', { name: 'Jul to Dec' }));
  expect(screen.getAllByRole('option')).toHaveLength(2);

  userEvent.click(screen.getByRole('option', { name: 'Jan to Jun' }));
  expect(handleChange.mock.calls[0][0].target.value).toBe(0);
});

test('should display disabled annual period select', () => {
  const handleChange = jest.fn();
  render(<PeriodSelect onChange={handleChange} periods={1} value={0} />);

  userEvent.click(screen.getByRole('button', { name: 'Jan to Dec' }));
  expect(screen.queryAllByRole('option')).toHaveLength(0);
});
