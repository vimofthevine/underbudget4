import { useAccountsDispatch } from '../contexts/account';

export function useModifyAccount(account) {
  const dispatch = useAccountsDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccount',
      payload: account,
    });
}
