import { useAccountDispatch } from '../contexts/account';

export function useModifyAccount(account) {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccount',
      payload: account,
    });
}
