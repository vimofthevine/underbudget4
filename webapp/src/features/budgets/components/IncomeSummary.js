import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchBudgetedIncomes from '../hooks/useFetchBudgetedIncomes';

const useStyles = makeStyles((theme) => ({
  incomeHeader: {
    display: 'flex',
    padding: theme.spacing(2, 2, 0),
  },
  editIcon: {
    marginLeft: 'auto',
  },
}));

const IncomeSummary = ({ budgetId }) => {
  const classes = useStyles();
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();
  const { error, incomes, status } = useFetchBudgetedIncomes({ budgetId });

  const handleEditNav = () => navigate('incomes');

  return (
    <>
      <Typography className={classes.incomeHeader} component='h2' variant='h6'>
        Incomes (per period)
        <IconButton
          aria-label='go to budget incomes'
          className={classes.editIcon}
          onClick={handleEditNav}
          size='small'
        >
          <ArrowForwardIcon />
        </IconButton>
      </Typography>
      {status === 'success' && (
        <List dense disablePadding>
          {incomes.map((income) => (
            <ListItem key={income.id}>
              <ListItemText primary={income.name} secondary={formatMoney(income.amount)} />
            </ListItem>
          ))}
        </List>
      )}
      {status === 'success' && incomes.length === 0 && (
        <Alert severity='info'>No incomes defined</Alert>
      )}
      {status === 'loading' && <CircularProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

IncomeSummary.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default IncomeSummary;
