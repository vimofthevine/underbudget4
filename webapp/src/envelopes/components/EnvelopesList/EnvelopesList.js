import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import useMobile from '../../../common/hooks/useMobile';
import useEnvelopes from '../../hooks/useEnvelopes';
import EnvelopeCategoryListItem from '../EnvelopeCategoryListItem';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const EnvelopesList = () => {
  const classes = useStyles();
  const mobile = useMobile();
  const { categories, error, status } = useEnvelopes();

  return (
    <>
      {status === 'success' && (
        <List className={classes.list} disablePadding>
          {categories.map((cat) => (
            <EnvelopeCategoryListItem category={cat} dense={!mobile} key={cat.id} />
          ))}
        </List>
      )}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

export default EnvelopesList;
