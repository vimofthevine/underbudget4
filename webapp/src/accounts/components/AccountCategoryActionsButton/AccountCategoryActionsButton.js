import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useDeleteAccountCategory from '../../hooks/useDeleteAccountCategory';
import AccountCategoryPropTypes from '../../utils/account-category-prop-types';

const AccountCategoryActionsButton = ({ category }) => {
  const navigate = useNavigateKeepingSearch();
  const confirm = useConfirmation();
  const { mutate } = useDeleteAccountCategory();
  const handleDelete = () =>
    confirm({
      message: [
        `Delete account category ${category.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(category.id);
    });

  const actions = [
    {
      'aria-label': 'Modify account category',
      icon: null,
      onClick: () => navigate(`modify-category/${category.id}`),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete account category',
      icon: null,
      onClick: handleDelete,
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

AccountCategoryActionsButton.propTypes = {
  category: AccountCategoryPropTypes.isRequired,
};

export default AccountCategoryActionsButton;
