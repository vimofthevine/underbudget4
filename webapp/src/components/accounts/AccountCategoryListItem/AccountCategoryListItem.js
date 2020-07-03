import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';

import AccountListItem from '../AccountListItem';

const AccountCategoryListItem = ({ category }) => {
  const [open, setOpen] = React.useState(true);
  const handleExpand = () => setOpen((old) => !old);
  return (
    <>
      <ListSubheader>
        {category.name}
        <ListItemSecondaryAction>
          <IconButton edge='end' onClick={handleExpand}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListSubheader>
      <Collapse in={open}>
        {category.accounts.map((acct) => (
          <AccountListItem account={acct} key={acct.id} />
        ))}
      </Collapse>
    </>
  );
};

AccountCategoryListItem.propTypes = {
  category: PropTypes.shape({
    accounts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountCategoryListItem;
