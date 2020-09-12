import { useAccountDispatch } from '../contexts/account';

export default function useModifyAccountCategory(category) {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccountCategory',
      payload: category,
    });
}
