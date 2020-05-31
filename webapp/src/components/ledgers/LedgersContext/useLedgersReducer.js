import React from 'react';

const initialState = {
  showCreateLedger: false,
  ledgerToModify: null,
  pagination: {
    page: 0,
    size: 10,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'showCreateLedger': {
      return {
        ...state,
        showCreateLedger: true,
      };
    }
    case 'hideCreateLedger': {
      return {
        ...state,
        showCreateLedger: false,
      };
    }
    case 'showModifyLedger': {
      return {
        ...state,
        ledgerToModify: action.payload,
      };
    }
    case 'hideModifyLedger': {
      return {
        ...state,
        ledgerToModify: null,
      };
    }
    case 'setPagination': {
      return {
        ...state,
        pagination: action.payload,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const useLedgersReducer = () => React.useReducer(reducer, initialState);
