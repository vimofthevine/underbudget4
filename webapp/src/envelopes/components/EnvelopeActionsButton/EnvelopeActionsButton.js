import React from 'react';

import MoreActionsButton from '../../../common/components/MoreActionsButton';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useDeleteEnvelope from '../../hooks/useDeleteEnvelope';
import EnvelopePropTypes from '../../utils/envelope-prop-types';

const EnvelopeActionsButton = ({ envelope }) => {
  const navigate = useNavigateKeepingSearch();
  const confirm = useConfirmation();
  const { mutate } = useDeleteEnvelope();
  const handleDelete = () =>
    confirm({
      message: [
        `Delete envelope ${envelope.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(envelope.id);
    });

  const actions = [
    {
      'aria-label': 'Modify envelope',
      icon: null,
      onClick: () => navigate(`modify/${envelope.id}`),
      text: 'Modify',
    },
    {
      'aria-label': 'Delete envelope',
      icon: null,
      onClick: handleDelete,
      text: 'Delete',
    },
  ];
  return <MoreActionsButton actions={actions} />;
};

EnvelopeActionsButton.propTypes = {
  envelope: EnvelopePropTypes.isRequired,
};

export default EnvelopeActionsButton;
