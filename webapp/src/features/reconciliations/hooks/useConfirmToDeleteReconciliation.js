import useConfirmation from 'common/hooks/useConfirmation';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import formatDate from 'common/utils/formatDate';
import useDeleteReconciliation from './useDeleteReconciliation';

export default ({ accountId, beginningDate, endingDate, id, parentRoute }) => {
  const confirm = useConfirmation();
  const navigate = useNavigateKeepingSearch();
  const { mutate } = useDeleteReconciliation({
    onSuccess: () => navigate(parentRoute),
  });

  if (accountId && id) {
    return () =>
      confirm({
        message: [
          `Delete reconciliation for ${formatDate(beginningDate)} - ${formatDate(endingDate)}?`,
          'This action is permanent and cannot be undone.',
        ],
      }).then(() => {
        mutate({ accountId, reconciliationId: id });
      });
  }

  return null;
};
