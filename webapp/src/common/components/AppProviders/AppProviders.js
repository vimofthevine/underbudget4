import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import React from 'react';

import { ConfirmationContextProvider } from '../../contexts/confirmation';
import { DrawerContextProvider } from '../../contexts/drawer';
import { SelectionContextProvider } from '../../contexts/selection';
import { SnackbarContextProvider } from '../../contexts/snackbar';

const AppProviders = ({ children }) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <ConfirmationContextProvider>
      <SnackbarContextProvider>
        <SelectionContextProvider>
          <DrawerContextProvider>{children}</DrawerContextProvider>
        </SelectionContextProvider>
      </SnackbarContextProvider>
    </ConfirmationContextProvider>
  </MuiPickersUtilsProvider>
);

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default AppProviders;
