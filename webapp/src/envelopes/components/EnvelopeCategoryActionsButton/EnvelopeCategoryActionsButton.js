import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useDeleteEnvelopeCategory from '../../hooks/useDeleteEnvelopeCategory';
import EnvelopeCategoryPropTypes from '../../utils/envelope-category-prop-types';

const EnvelopeCategoryActionsButton = ({ category }) => {
  const navigate = useNavigateKeepingSearch();
  const confirm = useConfirmation();
  const { mutate } = useDeleteEnvelopeCategory();
  const handleDelete = () =>
    confirm({
      message: [
        `Delete envelope category ${category.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(category.id);
    });

  const actions = [
    {
      'aria-label': 'Modify envelope category',
      icon: null,
      onClick: () => navigate(`modify-category/${category.id}`),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete envelope category',
      disabled: category.envelopes.length > 0,
      icon: null,
      onClick: handleDelete,
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

EnvelopeCategoryActionsButton.propTypes = {
  category: EnvelopeCategoryPropTypes.isRequired,
};

export default EnvelopeCategoryActionsButton;
