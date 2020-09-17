import { useEnvelopeDispatch } from '../contexts/envelope';

export default function useModifyEnvelopeCategory(category) {
  const dispatch = useEnvelopeDispatch();
  return () =>
    dispatch({
      type: 'showModifyEnvelopeCategory',
      payload: category,
    });
}
