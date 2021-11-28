import React from 'react';
import { usePrompt } from 'react-router-dom';

import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';

export default function usePromptToLeave(
  message = 'You have unsaved changes. Are you sure you wish to leave?',
) {
  const navigate = useNavigateKeepingSearch();
  const [dest, setDest] = React.useState(null);

  usePrompt(message, dest === null);

  // Do this in an effect so the prompt blocker is cleared first
  React.useEffect(() => {
    if (dest) {
      navigate(dest);
    }
  }, [dest]);

  return (d) => setDest(d);
}
