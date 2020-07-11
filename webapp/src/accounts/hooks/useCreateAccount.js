import { useAccountsDispatch } from '../contexts/account';

export function useCreateAccount() {
  const dispatch = useAccountsDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccount',
    });
}
