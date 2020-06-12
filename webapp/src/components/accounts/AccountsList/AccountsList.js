import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import AccountCategoryListItem from '../AccountCategoryListItem';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AccountsList = ({ accountCategories }) => {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      {accountCategories.map((cat) => (
        <AccountCategoryListItem category={cat} key={cat.id} />
      ))}
    </List>
  );
};

AccountsList.propTypes = {
  accountCategories: PropTypes.arrayOf(
    PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default AccountsList;
