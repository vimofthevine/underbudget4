import { useEnvelopeDispatch } from '../contexts/envelope';

export default function useModifyEnvelope(envelope) {
  const dispatch = useEnvelopeDispatch();
  return () =>
    dispatch({
      type: 'showModifyEnvelope',
      payload: envelope,
    });
}
