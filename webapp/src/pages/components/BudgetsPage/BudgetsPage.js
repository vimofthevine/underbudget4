import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import FullAppPage from '../../../common/components/FullAppPage';

const BudgetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({ tab: 'active' });
  const tabValue = searchParams.get('tab');
  const handleChangeTab = (e, tab) => setSearchParams({ tab });

  return (
    <FullAppPage title='Budgets'>
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
        <TabPanel value='active'>Active Budgets</TabPanel>
        <TabPanel value='all'>All Budgets</TabPanel>
      </TabContext>
    </FullAppPage>
  );
};

export default BudgetsPage;
