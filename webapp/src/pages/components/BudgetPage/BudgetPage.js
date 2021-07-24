import React from 'react';
import { useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import * as routes from 'common/utils/routes';

const parentRoute = { pathname: routes.BUDGETS, search: '' };

const BudgetPage = () => {
  const { id } = useParams();
  return <FullAppPage back={parentRoute}>{`budget ${id}`}</FullAppPage>;
};

export default BudgetPage;
