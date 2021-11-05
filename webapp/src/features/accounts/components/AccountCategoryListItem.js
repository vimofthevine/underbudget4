import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

import AccountCategoryPropTypes from '../utils/account-category-prop-types';
import AccountCategoryActionsButton from './AccountCategoryActionsButton';
import AccountListItem from './AccountListItem';

const AccountCategoryListItem = ({ category }) => {
  const [open, setOpen] = React.useState(true);
  const handleToggle = () => setOpen((old) => !old);
  return (
    <>
      <ListItem button onClick={handleToggle}>
        <ListItemIcon>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
        <ListItemText primary={category.name} />
        <ListItemSecondaryAction>
          <AccountCategoryActionsButton category={category} />
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open}>
        <List component='div' dense disablePadding>
          {category.accounts.map((account) => (
            <AccountListItem account={account} key={account.id} />
          ))}
        </List>
      </Collapse>
    </>
  );
};

AccountCategoryListItem.propTypes = {
  category: AccountCategoryPropTypes.isRequired,
};

export default AccountCategoryListItem;
