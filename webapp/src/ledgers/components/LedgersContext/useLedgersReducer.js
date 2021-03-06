import React from 'react';

const initialState = {
  showCreateLedger: false,
  showCreateDemoLedger: false,
  ledgerToModify: null,
  pagination: {
    page: 1,
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
    case 'showCreateDemoLedger': {
      return {
        ...state,
        showCreateDemoLedger: true,
      };
    }
    case 'hideCreateDemoLedger': {
      return {
        ...state,
        showCreateDemoLedger: false,
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
export const useLedgersReducer = (overrideState) =>
  React.useReducer(reducer, { ...initialState, ...overrideState });
