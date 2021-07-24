import React from 'react';
import { useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';

const BudgetExpensesPage = () => {
  const { id } = useParams();
  const parentRoute = React.useMemo(() => ({ pathname: `${routes.BUDGET}/${id}`, search: '' }), [
    id,
  ]);

  return <FullAppPage back={parentRoute}>{`expenses for budget ${id}`}</FullAppPage>;
};

export default BudgetExpensesPage;
