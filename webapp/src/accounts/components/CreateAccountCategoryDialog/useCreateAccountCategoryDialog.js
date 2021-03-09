import useAccountState from '../../hooks/useAccountState';
import useCreateAccountCategory from '../../hooks/useCreateAccountCategory';
import useAccountActions from '../../hooks/useAccountActions';

export default function useCreateAccountCategoryDialog() {
  const { hideCreateAccountCategory } = useAccountActions();
  const { showCreateAccountCategory } = useAccountState();

  const { mutate } = useCreateAccountCategory({
    onSuccess: () => {
      hideCreateAccountCategory();
    },
  });

  const handleCreate = (values, { setSubmitting }) =>
    mutate(values, { onSettled: () => setSubmitting(false) });

  return {
    dialogOpen: showCreateAccountCategory,
    handleCloseDialog: hideCreateAccountCategory,
    handleCreate,
  };
}
