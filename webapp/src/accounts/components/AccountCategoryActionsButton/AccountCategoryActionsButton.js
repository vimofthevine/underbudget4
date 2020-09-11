import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useDeleteAccountCategory from '../../hooks/useDeleteAccountCategory';
import useModifyAccountCategory from '../../hooks/useModifyAccountCategory';
import AccountCategoryPropTypes from '../../utils/account-category-prop-types';

const AccountCategoryActionsButton = ({ category }) => {
  const actions = [
    {
      'aria-label': 'Modify account category',
      icon: null,
      onClick: useModifyAccountCategory(category),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete account category',
      icon: null,
      onClick: useDeleteAccountCategory(category),
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

AccountCategoryActionsButton.propTypes = {
  category: AccountCategoryPropTypes.isRequired,
};

export default AccountCategoryActionsButton;
