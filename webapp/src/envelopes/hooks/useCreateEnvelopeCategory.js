import { useEnvelopeDispatch } from '../contexts/envelope';

export default function useCreateEnvelopeCategory() {
  const dispatch = useEnvelopeDispatch();
  return () =>
    dispatch({
      type: 'showCreateEnvelopeCategory',
    });
}
