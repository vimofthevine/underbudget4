import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import { FieldArray } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

import AddBalancingSplitButton from './AddBalancingSplitButton';

// Can't delete any split if there's only 2 (doesn't matter what type)
const disableRemove = ({ accountTransactions, envelopeTransactions }) => {
  return accountTransactions.length + envelopeTransactions.length <= 2;
};

const getBalanceKey = (name) =>
  name === 'accountTransactions' ? 'accountAmountToBalance' : 'envelopeAmountToBalance';

const SplitList = ({ addText, blank, name, SplitComponent }) => {
  return (
    <FieldArray name={name}>
      {({ form: { values }, push, remove }) => (
        <>
          {values[name].map((_, i) => (
            <SplitComponent
              disableRemove={disableRemove(values)}
              index={i}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              onRemove={() => remove(i)}
            />
          ))}
          <Grid item xs={12}>
            <Button
              color='secondary'
              onClick={() => push(blank)}
              startIcon={<AddIcon />}
              variant='contained'
            >
              {addText}
            </Button>
            <AddBalancingSplitButton balanceKey={getBalanceKey(name)} blank={blank} push={push} />
          </Grid>
        </>
      )}
    </FieldArray>
  );
};

SplitList.propTypes = {
  addText: PropTypes.string.isRequired,
  blank: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  SplitComponent: PropTypes.elementType.isRequired,
};

export default SplitList;
