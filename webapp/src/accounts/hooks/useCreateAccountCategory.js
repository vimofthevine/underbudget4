import { useAccountDispatch } from '../contexts/account';

export function useCreateAccountCategory() {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccountCategory',
    });
}
