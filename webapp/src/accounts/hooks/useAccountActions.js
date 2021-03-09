import { useAccountDispatch } from '../contexts/account';

export default () => {
  const dispatch = useAccountDispatch();
  return {
    hideCreateAccount: () => dispatch({ type: 'hideCreateAccount' }),
    showCreateAccount: () => dispatch({ type: 'showCreateAccount' }),

    hideCreateAccountCategory: () => dispatch({ type: 'hideCreateAccountCategory' }),
    showCreateAccountCategory: () => dispatch({ type: 'showCreateAccountCategory' }),

    hideModifyAccount: () => dispatch({ type: 'hideModifyAccount' }),
    showModifyAccount: () => dispatch({ type: 'showModifyAccount' }),

    hideModifyAccountCategory: () => dispatch({ type: 'hideModifyAccountCategory' }),
    showModifyAccountCategory: () => dispatch({ type: 'showModifyAccountCategory' }),
  };
};
