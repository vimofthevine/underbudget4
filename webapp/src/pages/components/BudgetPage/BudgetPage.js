import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';

import ExpenseSummary from 'budgets/components/ExpenseSummary';
import IncomeSummary from 'budgets/components/IncomeSummary';
import ModifyBudgetDialog from 'budgets/components/ModifyBudgetDialog';
import useFetchActiveBudgets from 'budgets/hooks/useFetchActiveBudgets';
import useFetchBudget from 'budgets/hooks/useFetchBudget';
import FullAppPage from 'common/components/FullAppPage';
import useConfirmation from 'common/hooks/useConfirmation';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';
import useDeleteBudget from 'budgets/hooks/useDeleteBudget';

const BudgetPage = () => {
  const confirm = useConfirmation();
  const { state } = useLocation();
  const { budgetsPageSearch = '' } = state || {};
  const navigate = useNavigateKeepingSearch();

  const { id } = useParams();
  const { data } = useFetchBudget({ id });
  const { budgets: activeBudgets } = useFetchActiveBudgets();

  const parentRoute = React.useMemo(
    () => ({ pathname: routes.BUDGETS, search: budgetsPageSearch }),
    [budgetsPageSearch],
  );

  const isActive = React.useMemo(() => {
    const idAsInt = parseInt(id, 10);
    return !!activeBudgets.find((b) => b.budgetId === idAsInt);
  }, [activeBudgets, id]);

  const { mutate: deleteBudget } = useDeleteBudget({
    onSuccess: () => navigate(parentRoute),
  });

  const handleDelete = React.useCallback(
    () =>
      confirm({
        message: [
          `Delete budget ${data && data.name}?`,
          'This action is permanent and cannot be undone.',
        ],
      }).then(() => deleteBudget(id)),
    [data, id],
  );

  const primaryActions = [
    {
      'aria-label': 'Modify budget',
      icon: <EditIcon />,
      onClick: () => navigate('modify'),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete budget',
      disabled: isActive,
      icon: <DeleteIcon />,
      onClick: handleDelete,
      text: 'Delete',
    },
  ];

  const title = data ? data.name : '...';

  return (
    <FullAppPage back={parentRoute} primaryActions={primaryActions} title={title}>
      <IncomeSummary budgetId={id} />
      <ExpenseSummary budgetId={id} periods={data ? data.periods : 1} />
      <Routes>
        <Route path='modify' element={<ModifyBudgetDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default BudgetPage;
