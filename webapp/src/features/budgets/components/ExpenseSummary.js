import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import useFormatMoney from 'common/hooks/useFormatMoney';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchBudgetedExpenses from '../hooks/useFetchBudgetedExpenses';
import { values } from '../utils/periods';
import PeriodSelect from './PeriodSelect';

const useStyles = makeStyles((theme) => ({
  expenseHeader: {
    display: 'flex',
    padding: theme.spacing(2, 2, 0),
  },
  periodSelect: {
    marginLeft: theme.spacing(1),
  },
  editIcon: {
    marginLeft: 'auto',
  },
}));

const ExpenseSummary = ({ budgetId, periods }) => {
  const classes = useStyles();
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();
  const [searchParams, setSearchParams] = useSearchParams({ period: 0 });
  const period = parseInt(searchParams.get('period'), 10);
  const { error, expenses, status } = useFetchBudgetedExpenses({ budgetId, period });

  const handleEditNav = () => navigate('expenses');
  const handleChangePeriod = (e) => setSearchParams({ period: e.target.value });

  return (
    <>
      <Typography className={classes.expenseHeader} component='h2' variant='h6'>
        Expenses for
        <FormControl>
          <PeriodSelect
            className={classes.periodSelect}
            onChange={handleChangePeriod}
            periods={periods}
            value={period}
          />
        </FormControl>
        <IconButton
          aria-label='go to budget expenses'
          className={classes.editIcon}
          onClick={handleEditNav}
          size='small'
        >
          <ArrowForwardIcon />
        </IconButton>
      </Typography>
      {status === 'success' && (
        <List dense disablePadding>
          {expenses.map((expense) => (
            <ListItem key={expense.envelopeId}>
              <ListItemText primary={expense.name} secondary={formatMoney(expense.amount)} />
            </ListItem>
          ))}
        </List>
      )}
      {status === 'success' && expenses.length === 0 && (
        <Alert severity='info'>No expenses defined</Alert>
      )}
      {status === 'loading' && <CircularProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

ExpenseSummary.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  periods: PropTypes.oneOf(values).isRequired,
};

export default ExpenseSummary;
