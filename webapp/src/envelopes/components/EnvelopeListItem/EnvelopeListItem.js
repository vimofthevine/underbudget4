import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { envelopeRoute } from '../../../common/utils/routes';
import EnvelopePropTypes from '../../utils/envelope-prop-types';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const EnvelopeListItem = ({ envelope, dense }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = () => navigate(envelopeRoute(envelope.id));

  return (
    <ListItem button className={classes.item} dense={dense} onClick={handleClick}>
      <ListItemText inset primary={envelope.name} />
    </ListItem>
  );
};

EnvelopeListItem.propTypes = {
  envelope: EnvelopePropTypes.isRequired,
  dense: PropTypes.bool.isRequired,
};

export default EnvelopeListItem;
