import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';
import { useParams } from 'react-router-dom';

import PeriodicIncomesList from 'budgets/components/PeriodicIncomesList';
import useFetchBudget from 'budgets/hooks/useFetchBudget';
import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';

const BudgetIncomesPage = () => {
  const { id } = useParams();
  const { data } = useFetchBudget({ id });

  const parentRoute = React.useMemo(() => ({ pathname: `${routes.BUDGET}/${id}`, search: '' }), [
    id,
  ]);

  const primaryActions = [
    {
      'aria-label': 'Create periocic income',
      icon: <AddCircleIcon />,
      onClick: () => 0,
      text: 'Create periodic income',
    },
  ];

  const title = data ? `${data.name} Incomes` : '...';

  return (
    <FullAppPage back={parentRoute} primaryActions={primaryActions} title={title}>
      <PeriodicIncomesList budgetId={id} />
    </FullAppPage>
  );
};

export default BudgetIncomesPage;
