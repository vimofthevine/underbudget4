import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import ActiveBudgetsList from 'budgets/components/ActiveBudgetsList';
import AllBudgetsList from 'budgets/components/AllBudgetsList';

const BudgetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: 'active' });
  const tabValue = searchParams.get('tab');
  const handleChangeTab = (e, tab) => setSearchParams({ tab });

  const actions = [
    {
      'aria-label': 'Set active budget',
      icon: <CheckCircleIcon />,
      onClick: () => 0,
      text: 'Set active budget',
    },
    {
      'aria-label': 'Create budget',
      icon: <AddCircleIcon />,
      onClick: () => 0,
      text: 'Create budget',
    },
  ];

  return (
    <FullAppPage primaryActions={actions} title='Budgets'>
      <TabContext value={tabValue}>
        <Paper>
          <TabList
            aria-label='budget tabs'
            centered
            indicatorColor='primary'
            onChange={handleChangeTab}
          >
            <Tab value='active' label='Active' />
            <Tab value='all' label='All' />
          </TabList>
        </Paper>
        <TabPanel value='active'>
          <ActiveBudgetsList />
        </TabPanel>
        <TabPanel value='all'>
          <AllBudgetsList />
        </TabPanel>
      </TabContext>
    </FullAppPage>
  );
};

export default BudgetsPage;
