import React from 'react';
import { useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';

const BudgetIncomesPage = () => {
  const { id } = useParams();
  const parentRoute = React.useMemo(() => ({ pathname: `${routes.BUDGET}/${id}`, search: '' }), [
    id,
  ]);

  return <FullAppPage back={parentRoute}>{`incomes for budget ${id}`}</FullAppPage>;
};

export default BudgetIncomesPage;
