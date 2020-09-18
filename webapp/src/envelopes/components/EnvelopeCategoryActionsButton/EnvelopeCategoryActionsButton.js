import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useDeleteEnvelopeCategory from '../../hooks/useDeleteEnvelopeCategory';
import useModifyEnvelopeCategory from '../../hooks/useModifyEnvelopeCategory';
import EnvelopeCategoryPropTypes from '../../utils/envelope-category-prop-types';

const EnvelopeCategoryActionsButton = ({ category }) => {
  const actions = [
    {
      'aria-label': 'Modify envelope category',
      icon: null,
      onClick: useModifyEnvelopeCategory(category),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete envelope category',
      icon: null,
      onClick: useDeleteEnvelopeCategory(category),
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

EnvelopeCategoryActionsButton.propTypes = {
  category: EnvelopeCategoryPropTypes.isRequired,
};

export default EnvelopeCategoryActionsButton;
