import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';

import LoginForm from '../LoginForm';
import { useLogin } from './hooks';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(2, 1, 1),
  },
  form: {
    marginTop: theme.spacing(1),
  },
  paper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(8),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const { dismissError, errorMessage, handleLogin } = useLogin();

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>

        <LoginForm className={classes.form} onLogin={handleLogin} />
      </Paper>

      <Snackbar
        autoHideDuration={3000}
        message={errorMessage}
        onClose={dismissError}
        open={Boolean(errorMessage)}
      />
    </Container>
  );
};

export default LoginPage;
