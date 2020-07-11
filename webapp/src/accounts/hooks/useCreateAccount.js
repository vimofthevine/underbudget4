import { useAccountDispatch } from '../contexts/account';

export function useCreateAccount() {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccount',
    });
}
