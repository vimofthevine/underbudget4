import { useAccountDispatch } from '../contexts/account';

export default function useCreateAccountCategory() {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showCreateAccountCategory',
    });
}
