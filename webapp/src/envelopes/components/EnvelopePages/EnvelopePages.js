import React from 'react';

import { EnvelopeContextProvider } from '../../contexts/envelope';
import EnvelopesListPage from '../EnvelopesListPage';

const EnvelopePages = () => (
  <EnvelopeContextProvider>
    <EnvelopesListPage />
  </EnvelopeContextProvider>
);

export default EnvelopePages;
