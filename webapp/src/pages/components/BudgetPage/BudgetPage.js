import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';
import useFetchBudget from 'budgets/hooks/useFetchBudget';

const BudgetPage = () => {
  const { state: { budgetsPageSearch = '' } = {} } = useLocation();
  const navigate = useNavigateKeepingSearch();

  const { id } = useParams();
  const { data } = useFetchBudget({ id });

  const parentRoute = React.useMemo(
    () => ({ pathname: routes.BUDGETS, search: budgetsPageSearch }),
    [budgetsPageSearch],
  );

  const primaryActions = [
    {
      'aria-label': 'Modify budget',
      icon: <EditIcon />,
      onClick: () => navigate('modify'),
      text: 'Modify',
    },
  ];

  const title = React.useMemo(() => {
    if (!data) {
      return '...';
    }
    return data.name;
  }, [data]);

  return (
    <FullAppPage
      back={parentRoute}
      primaryActions={primaryActions}
      title={title}
    >{`budget ${id}`}</FullAppPage>
  );
};

export default BudgetPage;
