import { useAccountDispatch } from '../contexts/account';

export default function useModifyAccount(account) {
  const dispatch = useAccountDispatch();
  return () =>
    dispatch({
      type: 'showModifyAccount',
      payload: account,
    });
}
