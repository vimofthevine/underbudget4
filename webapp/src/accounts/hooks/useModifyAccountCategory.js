import { useAccountsDispatch } from '../contexts/account';

export function useModifyAccountCategory(category) {
  const dispatch = useAccountsDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccountCategory',
      payload: category,
    });
}
