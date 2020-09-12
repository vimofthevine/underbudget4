import React from 'react';

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case 'clear':
      return [];

    case 'select':
      return [...state, action.payload];

    case 'unselect':
      return state.filter((i) => i !== action.payload);

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default () => React.useReducer(reducer, initialState);
