import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import * as routes from 'common/utils/routes';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(0, 0, 3),
  },
}));

const BudgetCard = ({ budget }) => {
  const classes = useStyles();
  const navigate = useNavigateKeepingSearch();

  const handleSelect = () => navigate(routes.budgetRoute(budget.budgetId || budget.id));
  const handleChange = () => navigate(`modify-active/${budget.id}`);

  return (
    <Card className={classes.card} raised>
      <CardActionArea onClick={handleSelect}>
        {budget.year && <CardHeader title={budget.year} />}
        <CardContent>{budget.name}</CardContent>
      </CardActionArea>
      {budget.year && (
        <CardActions>
          <Button color='primary' onClick={handleChange} size='small'>
            Change
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

BudgetCard.propTypes = {
  budget: PropTypes.shape({
    id: PropTypes.number.isRequired,
    budgetId: PropTypes.number,
    name: PropTypes.string.isRequired,
    year: PropTypes.number,
  }).isRequired,
};

export default BudgetCard;
