import { useAccountDispatch } from '../contexts/account';

export function useModifyAccountCategory(category) {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccountCategory',
      payload: category,
    });
}
