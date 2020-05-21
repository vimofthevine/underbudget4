import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import { createMuiTheme } from '@material-ui/core/styles';

export default (darkMode) =>
  createMuiTheme({
    palette: {
      primary: {
        main: green[100],
      },
      secondary: {
        main: indigo[100],
      },
      type: darkMode ? 'dark' : 'light',
    },
    // Need stronger contrast for some text items in light mode
    overrides: !darkMode && {
      MuiButton: {
        textPrimary: {
          color: green[300],
        },
      },
      MuiFormLabel: {
        root: {
          '&$focused': {
            color: green[400],
          },
        },
      },
      MuiTypography: {
        colorSecondary: {
          color: indigo[400],
        },
      },
    },
  });
