import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';
import React from 'react';

import render from '../../../tests/renderWithRouter';
import AppPage from './AppPage';

const createMediaQuery = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => 0,
  removeListener: () => 0,
});

describe('AppPage', () => {
  it('should render default title when none specified', () => {
    const { getByText } = render(
      <AppPage>
        <div />
      </AppPage>,
    );

    expect(getByText('UnderBudget')).toBeInTheDocument();
  });

  it('should render specified title', () => {
    const { getByText } = render(
      <AppPage title='Page Title'>
        <div />
      </AppPage>,
    );

    expect(getByText('Page Title')).toBeInTheDocument();
  });

  describe('should toggle drawer when menu button is clicked', () => {
    it('when mobile', async () => {
      window.matchMedia = createMediaQuery('400px');

      const { getByLabelText, getByText, queryByText } = render(
        <AppPage>
          <div />
        </AppPage>,
      );

      expect(queryByText('Dashboard')).toBeNull();

      fireEvent.click(getByLabelText('open drawer'));
      await waitFor(() => expect(getByText('Dashboard')).toBeInTheDocument());

      fireEvent.click(getByLabelText('open drawer'));
      await waitForElementToBeRemoved(() => queryByText('Dashboard'));
    });

    it('when desktop', () => {
      window.matchMedia = createMediaQuery('800px');

      const { container, getByLabelText, getByText, queryByText } = render(
        <AppPage>
          <div />
        </AppPage>,
      );

      expect(getByText('Dashboard')).toBeInTheDocument();
      expect(container.querySelector('.MuiDrawer-paper')).not.toHaveStyle({ width: '240px' });

      fireEvent.click(getByLabelText('open drawer'));
      expect(container.querySelector('.MuiDrawer-paper')).toHaveStyle({ width: '240px' });

      fireEvent.click(getByLabelText('open drawer'));
      expect(container.querySelector('.MuiDrawer-paper')).not.toHaveStyle({ width: '240px' });
    });
  });

  it('should navigate to pages from drawer links', () => {
    window.matchMedia = createMediaQuery('800px');

    const { getByText, history } = render(
      <AppPage>
        <div />
      </AppPage>,
    );

    fireEvent.click(getByText('Ledgers'));
    expect(history.location.pathname).toBe('/ledgers');

    fireEvent.click(getByText('Dashboard'));
    expect(history.location.pathname).toBe('/');

    fireEvent.click(getByText('Accounts'));
    expect(history.location.pathname).toBe('/accounts');

    fireEvent.click(getByText('Envelopes'));
    expect(history.location.pathname).toBe('/envelopes');

    fireEvent.click(getByText('Incomes'));
    expect(history.location.pathname).toBe('/incomes');

    fireEvent.click(getByText('Expenses'));
    expect(history.location.pathname).toBe('/expenses');

    fireEvent.click(getByText('Reports'));
    expect(history.location.pathname).toBe('/reports');
  });

  it('should navigate to pages from account drawer links on mobile', async () => {
    window.matchMedia = createMediaQuery('400px');

    const { getByLabelText, getByText, history, queryByText } = render(
      <AppPage>
        <div />
      </AppPage>,
    );

    expect(queryByText('Access Tokens')).toBeNull();
    expect(queryByText('Logout')).toBeNull();

    fireEvent.click(getByLabelText('open drawer'));
    await waitFor(() => expect(getByText('Access Tokens')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Logout')).toBeInTheDocument());

    fireEvent.click(getByText('Access Tokens'));
    expect(history.location.pathname).toBe('/tokens');

    fireEvent.click(getByText('Logout'));
    expect(history.location.pathname).toBe('/logout');
  });

  it('should navigate to pages from account menu links', async () => {
    window.matchMedia = createMediaQuery('800px');

    const { getByLabelText, getByText, history, queryByText } = render(
      <AppPage>
        <div />
      </AppPage>,
    );

    expect(queryByText('Access Tokens')).toBeNull();
    expect(queryByText('Logout')).toBeNull();

    fireEvent.click(getByLabelText('open account menu'));
    await waitFor(() => expect(getByText('Access Tokens')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Logout')).toBeInTheDocument());

    fireEvent.click(getByText('Access Tokens'));
    expect(history.location.pathname).toBe('/tokens');

    fireEvent.click(getByText('Logout'));
    expect(history.location.pathname).toBe('/logout');

    fireEvent.keyDown(getByText('Logout'), { key: 'Tab', code: 'Tab' });
    await waitForElementToBeRemoved(() => queryByText('Access Tokens'));
    expect(queryByText('Logout')).toBeNull();
  });
});
