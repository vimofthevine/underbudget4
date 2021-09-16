import { useFormikContext } from 'formik';
import { usePrompt } from 'react-router-dom';

export default (message = 'You have unsaved changes. Are you sure you wish to leave?') => {
  const { dirty } = useFormikContext();
  usePrompt(message, dirty);
};
