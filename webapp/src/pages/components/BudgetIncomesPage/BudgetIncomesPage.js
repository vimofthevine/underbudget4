import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

import CreatePeriodicIncomeDialog from 'budgets/components/CreatePeriodicIncomeDialog';
import ModifyPeriodicIncomeDialog from 'budgets/components/ModifyPeriodicIncomeDialog';
import PeriodicIncomesList from 'budgets/components/PeriodicIncomesList';
import useFetchBudget from 'budgets/hooks/useFetchBudget';
import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';

const BudgetIncomesPage = () => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data } = useFetchBudget({ id });

  const parentRoute = React.useMemo(() => ({ pathname: `${routes.BUDGET}/${id}`, search: '' }), [
    id,
  ]);

  const primaryActions = [
    {
      'aria-label': 'Create periodic income',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create-periodic'),
      text: 'Create periodic income',
    },
  ];

  const title = data ? `${data.name} Incomes` : '...';

  return (
    <FullAppPage back={parentRoute} primaryActions={primaryActions} title={title}>
      <PeriodicIncomesList budgetId={id} />
      <Routes>
        <Route path='create-periodic' element={<CreatePeriodicIncomeDialog budgetId={id} />} />
        <Route
          path='modify-periodic/:incomeId'
          element={<ModifyPeriodicIncomeDialog budgetId={id} />}
        />
      </Routes>
    </FullAppPage>
  );
};

export default BudgetIncomesPage;
