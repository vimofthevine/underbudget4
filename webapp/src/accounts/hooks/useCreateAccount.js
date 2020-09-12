import { useAccountDispatch } from '../contexts/account';

export default function useCreateAccount() {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccount',
    });
}
