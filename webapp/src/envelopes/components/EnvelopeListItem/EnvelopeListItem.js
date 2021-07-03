import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useNavigate } from 'react-router';

import useFormatMoney from 'common/hooks/useFormatMoney';
import { envelopeRoute } from 'common/utils/routes';
import useFetchEnvelopeBalance from '../../hooks/useFetchEnvelopeBalance';
import EnvelopePropTypes from '../../utils/envelope-prop-types';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const EnvelopeListItem = ({ envelope }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = () => navigate(envelopeRoute(envelope.id));
  const formatMoney = useFormatMoney();
  const { data, isLoading } = useFetchEnvelopeBalance({ id: envelope.id });

  const balance = React.useMemo(() => {
    if (isLoading) {
      return '...';
    }
    if (data) {
      return formatMoney(data.balance);
    }
    return '';
  }, [data, isLoading, formatMoney]);

  return (
    <ListItem button className={classes.item} onClick={handleClick}>
      <ListItemText inset primary={envelope.name} secondary={balance} />
    </ListItem>
  );
};

EnvelopeListItem.propTypes = {
  envelope: EnvelopePropTypes.isRequired,
};

export default EnvelopeListItem;
