import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { envelopeRoute } from '../../../common/utils/routes';
import useFormatMoney from '../../../ledgers/hooks/useFormatMoney';
import useFetchEnvelopeBalance from '../../hooks/useFetchEnvelopeBalance';
import EnvelopePropTypes from '../../utils/envelope-prop-types';
import EnvelopeActionsButton from '../EnvelopeActionsButton';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const EnvelopeListItem = ({ envelope, dense }) => {
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
    <ListItem button className={classes.item} dense={dense} onClick={handleClick}>
      <ListItemText inset primary={envelope.name} secondary={balance} />
      <ListItemSecondaryAction>
        <EnvelopeActionsButton envelope={envelope} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

EnvelopeListItem.propTypes = {
  envelope: EnvelopePropTypes.isRequired,
  dense: PropTypes.bool.isRequired,
};

export default EnvelopeListItem;
