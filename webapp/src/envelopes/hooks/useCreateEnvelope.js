import { useEnvelopeDispatch } from '../contexts/envelope';

export default function useCreateEnvelope() {
  const dispatch = useEnvelopeDispatch();
  return () =>
    dispatch({
      type: 'showCreateEnvelope',
    });
}
