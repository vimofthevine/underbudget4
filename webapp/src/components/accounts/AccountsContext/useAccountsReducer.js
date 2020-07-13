import React from 'react';

const initialState = {
  showCreateAccountCategory: false,
  showCreateAccount: false,

  accountCategoryToModify: null,
  accountToModify: null,

  // selectedAccountCategories: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'showCreateAccountCategory': {
      return {
        ...state,
        showCreateAccountCategory: true,
      };
    }
    case 'hideCreateAccountCategory': {
      return {
        ...state,
        showCreateAccountCategory: false,
      };
    }

    case 'showCreateAccount': {
      return {
        ...state,
        showCreateAccount: true,
      };
    }
    case 'hideCreateAccount': {
      return {
        ...state,
        showCreateAccount: false,
      };
    }

    case 'showModifyAccountCategory': {
      return {
        ...state,
        accountCategoryToModify: action.payload,
      };
    }
    case 'hideModifyAccountCategory': {
      return {
        ...state,
        accountCategoryToModify: null,
      };
    }

    case 'showModifyAccount': {
      return {
        ...state,
        accountToModify: action.payload,
      };
    }
    case 'hideModifyAccount': {
      return {
        ...state,
        accountToModify: null,
      };
    }

    // case 'selectAccountCategory': {
    //   return {
    //     ...state,
    //     selectedAccountCategories: [...state.selectedAccountCategories, action.payload],
    //   };
    // }
    // case 'unselectAccountCategory': {
    //   return {
    //     ...state,
    //     selectedAccountCategories: state.selectedAccountCategories.filter(
    //       (i) => i !== action.payload,
    //     ),
    //   };
    // }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const useAccountsReducer = () => React.useReducer(reducer, initialState);
