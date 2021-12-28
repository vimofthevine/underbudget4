import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';
import formatDate from 'common/utils/formatDate';

import reconciliationPropType from '../types/reconciliation-prop-type';

const getDateRange = (reconciliation) =>
  `${formatDate(reconciliation.beginningDate)} - ${formatDate(reconciliation.endingDate)}`;

const ReconciliationsList = ({ onSelect, reconciliations }) => {
  const formatMoney = useFormatMoney();

  return (
    <List dense disablePadding>
      {reconciliations.map((reconciliation) => (
        <ListItem button key={reconciliation.id} onClick={() => onSelect(reconciliation.id)}>
          <ListItemText
            primary={getDateRange(reconciliation)}
            secondary={formatMoney(reconciliation.endingBalance)}
          />
        </ListItem>
      ))}
    </List>
  );
};

ReconciliationsList.propTypes = {
  onSelect: PropTypes.func.isRequired,
  reconciliations: PropTypes.arrayOf(reconciliationPropType).isRequired,
};

export default ReconciliationsList;
