import React from 'react';

const initialState = {
  showCreateEnvelopeCategory: false,
  showCreateEnvelope: false,

  envelopeCategoryToModify: null,
  envelopeToModify: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'showCreateEnvelopeCategory': {
      return {
        ...state,
        showCreateEnvelopeCategory: true,
      };
    }
    case 'hideCreateEnvelopeCategory': {
      return {
        ...state,
        showCreateEnvelopeCategory: false,
      };
    }

    case 'showCreateEnvelope': {
      return {
        ...state,
        showCreateEnvelope: true,
      };
    }
    case 'hideCreateEnvelope': {
      return {
        ...state,
        showCreateEnvelope: false,
      };
    }

    case 'showModifyEnvelopeCategory': {
      return {
        ...state,
        envelopeCategoryToModify: action.payload,
      };
    }
    case 'hideModifyEnvelopeCategory': {
      return {
        ...state,
        envelopeCategoryToModify: null,
      };
    }

    case 'showModifyEnvelope': {
      return {
        ...state,
        envelopeToModify: action.payload,
      };
    }
    case 'hideModifyEnvelope': {
      return {
        ...state,
        envelopeToModify: null,
      };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default () => React.useReducer(reducer, initialState);
