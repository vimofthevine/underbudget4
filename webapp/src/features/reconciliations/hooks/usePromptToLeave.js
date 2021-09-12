import { useFormikContext } from 'formik';

import usePrompt from 'common/hooks/usePrompt';

const createMessage = ({ location }) => {
  if (location.pathname.endsWith('create-reconciliation/create-transaction')) {
    return true;
  }
  return 'You have unsaved changes. Are you sure you wish to leave?';
};

export default () => {
  const { dirty } = useFormikContext();
  usePrompt(createMessage, dirty);
};
