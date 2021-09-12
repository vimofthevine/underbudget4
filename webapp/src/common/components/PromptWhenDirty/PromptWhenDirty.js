import { useFormikContext } from 'formik';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const PromptWhenDirty = ({ message }) => {
  const { dirty } = useFormikContext();
  return <Prompt message={message} when={dirty} />;
};

PromptWhenDirty.propTypes = {
  message: PropTypes.string,
};

PromptWhenDirty.defaultProps = {
  message: 'You have unsaved changes. Are you sure you wish to leave?',
};

export default PromptWhenDirty;
