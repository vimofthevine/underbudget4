import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import React from 'react';
import { Routes, Route, useParams, useSearchParams } from 'react-router-dom';

import AnnualExpensesList from 'budgets/components/AnnualExpensesList';
import CreateAnnualExpenseDialog from 'budgets/components/CreateAnnualExpenseDialog';
import CreatePeriodicExpenseDialog from 'budgets/components/CreatePeriodicExpenseDialog';
import ModifyAnnualExpenseDialog from 'budgets/components/ModifyAnnualExpenseDialog';
import ModifyPeriodicExpenseDialog from 'budgets/components/ModifyPeriodicExpenseDialog';
import PeriodicExpensesList from 'budgets/components/PeriodicExpensesList';
import useFetchBudget from 'budgets/hooks/useFetchBudget';
import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';

const useStyles = makeStyles({
  tabPanel: {
    padding: 0,
  },
});

const BudgetExpensesPage = () => {
  const classes = useStyles();
  const navigate = useNavigateKeepingSearch();

  const [searchParams, setSearchParams] = useSearchParams({ tab: 'periodic' });
  const tabValue = searchParams.get('tab');
  const handleChangeTab = (e, tab) => setSearchParams({ tab });

  const { id } = useParams();
  const { data } = useFetchBudget({ id });

  const parentRoute = React.useMemo(() => ({ pathname: `${routes.BUDGET}/${id}`, search: '' }), [
    id,
  ]);

  const primaryActions = [
    {
      'aria-label': `Create ${tabValue} expense`,
      icon: <AddCircleIcon />,
      onClick: () => navigate(`create-${tabValue}`),
      text: `Create ${tabValue} expense`,
    },
  ];

  const title = data ? `${data.name} Expenses` : '...';
  const periods = data ? data.periods : 1;

  return (
    <FullAppPage back={parentRoute} primaryActions={primaryActions} title={title}>
      <TabContext value={tabValue}>
        <Paper>
          <TabList
            aria-label='expense tabs'
            centered
            indicatorColor='primary'
            onChange={handleChangeTab}
          >
            <Tab value='periodic' label='Periodic' />
            <Tab value='annual' label='Annual' />
          </TabList>
        </Paper>
        <TabPanel className={classes.tabPanel} value='periodic'>
          <PeriodicExpensesList budgetId={id} />
        </TabPanel>
        <TabPanel className={classes.tabPanel} value='annual'>
          <AnnualExpensesList budgetId={id} />
        </TabPanel>
      </TabContext>
      <Routes>
        <Route path='create-periodic' element={<CreatePeriodicExpenseDialog budgetId={id} />} />
        <Route
          path='modify-periodic/:expenseId'
          element={<ModifyPeriodicExpenseDialog budgetId={id} />}
        />
        <Route
          path='create-annual'
          element={<CreateAnnualExpenseDialog budgetId={id} periods={periods} />}
        />
        <Route
          path='modify-annual/:expenseId'
          element={<ModifyAnnualExpenseDialog budgetId={id} periods={periods} />}
        />
      </Routes>
    </FullAppPage>
  );
};

export default BudgetExpensesPage;
