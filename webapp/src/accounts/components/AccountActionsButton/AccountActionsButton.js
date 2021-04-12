import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useDeleteAccount from '../../hooks/useDeleteAccount';
import AccountPropTypes from '../../utils/account-prop-types';

const AccountActionsButton = ({ account }) => {
  const navigate = useNavigateKeepingSearch();
  const confirm = useConfirmation();
  const { mutate } = useDeleteAccount();
  const handleDelete = () =>
    confirm({
      message: [
        `Delete account ${account.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(account.id);
    });

  const actions = [
    {
      'aria-label': 'Modify account',
      icon: null,
      onClick: () => navigate(`modify/${account.id}`),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete account',
      icon: null,
      onClick: handleDelete,
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

AccountActionsButton.propTypes = {
  account: AccountPropTypes.isRequired,
};

export default AccountActionsButton;
