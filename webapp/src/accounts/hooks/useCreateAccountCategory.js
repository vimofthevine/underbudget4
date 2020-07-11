import { useAccountsDispatch } from '../contexts/account';

export function useCreateAccountCategory() {
  const dispatch = useAccountsDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccountCategory',
    });
}
