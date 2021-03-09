import React from 'react';

const initialState = {
  showCreateAccountCategory: false,
  showCreateAccount: false,

  accountCategoryToModify: null,
  accountToModify: null,
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

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default (overrideState) => React.useReducer(reducer, { ...initialState, ...overrideState });
