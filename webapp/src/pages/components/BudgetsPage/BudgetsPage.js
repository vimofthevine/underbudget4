import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import ActiveBudgetsList from 'budgets/components/ActiveBudgetsList';
import AllBudgetsList from 'budgets/components/AllBudgetsList';
import CreateActiveBudgetDialog from 'budgets/components/CreateActiveBudgetDialog';
import CreateBudgetDialog from 'budgets/components/CreateBudgetDialog';
import ModifyActiveBudgetDialog from 'budgets/components/ModifyActiveBudgetDialog';

const useStyles = makeStyles({
  tabPanel: {
    padding: 0,
  },
});

const BudgetsPage = () => {
  const classes = useStyles();
  const navigate = useNavigateKeepingSearch();

  const [searchParams, setSearchParams] = useSearchParams({ tab: 'active' });
  const tabValue = searchParams.get('tab');
  const handleChangeTab = (e, tab) => setSearchParams({ tab });

  const actions = [
    {
      'aria-label': 'Set active budget',
      icon: <CheckCircleIcon />,
      onClick: () => navigate('set-active'),
      text: 'Set active budget',
    },
    {
      'aria-label': 'Create budget',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create'),
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
        <TabPanel className={classes.tabPanel} value='active'>
          <ActiveBudgetsList />
        </TabPanel>
        <TabPanel className={classes.tabPanel} value='all'>
          <AllBudgetsList />
        </TabPanel>
      </TabContext>
      <Routes>
        <Route path='create' element={<CreateBudgetDialog />} />
        <Route path='set-active' element={<CreateActiveBudgetDialog />} />
        <Route path='modify-active/:id' element={<ModifyActiveBudgetDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default BudgetsPage;
