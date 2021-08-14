import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom';

import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';
import { labels as periodLabels } from '../../utils/periods';

const ListOfBudgets = ({ budgets, onSelect, onSetActive }) => {
  return (
    <List dense disablePadding>
      {budgets.map((budget) => (
        <ListItem button key={budget.id} onClick={() => onSelect(budget.budgetId || budget.id)}>
          <ListItemText
            primary={budget.year || budget.name}
            secondary={budget.year ? budget.name : periodLabels[budget.periods]}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label='change active budget' onClick={() => onSetActive(budget.id)}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

ListOfBudgets.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      budgetId: PropTypes.number,
      year: PropTypes.number,
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  onSetActive: PropTypes.func.isRequired,
};

const BudgetsList = ({ useFetchBudgets }) => {
  const { search } = useLocation();
  const navigate = useNavigateKeepingSearch();
  const { budgets, error, status } = useFetchBudgets();

  const handleSelect = (id) =>
    navigate(
      {
        pathname: routes.budgetRoute(id),
        search: '',
      },
      {
        state: { budgetsPageSearch: search },
      },
    );
  const handleSetActive = (id) => navigate(`modify-active/${id}`);

  return (
    <>
      {status === 'success' && (
        <ListOfBudgets budgets={budgets} onSelect={handleSelect} onSetActive={handleSetActive} />
      )}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

BudgetsList.propTypes = {
  useFetchBudgets: PropTypes.func.isRequired,
};

export default BudgetsList;
