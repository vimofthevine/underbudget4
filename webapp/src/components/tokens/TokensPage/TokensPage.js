import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import AppPage from '../../common/AppPage';
import TokensTable from '../TokensTable';
import { useTokens } from './useTokens';

const TokensPage = () => {
  const { error, handleDelete, mobile, status, tokens } = useTokens();

  return (
    <AppPage title='Access Tokens'>
      <Paper>
        <TokensTable mobile={mobile} onDelete={handleDelete} tokens={tokens} />
        {status === 'loading' && <LinearProgress />}
        {status === 'error' && <Alert severity='error'>{error.message}</Alert>}
      </Paper>
    </AppPage>
  );
};

export default TokensPage;
