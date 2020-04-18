import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';

import { useLogout } from './useLogout';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(2, 1, 1),
  },
  loginButton: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 5),
    marginTop: theme.spacing(8),
  },
}));

const LogoutPage = () => {
  const classes = useStyles();
  const { handleLogin } = useLogout();

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component='h1' variant='h5'>
          You&apos;ve been logged out!
        </Typography>

        <Button
          className={classes.loginButton}
          color='primary'
          fullWidth
          onClick={handleLogin}
          variant='contained'
        >
          Log in again
        </Button>
      </Paper>
    </Container>
  );
};

export default LogoutPage;
