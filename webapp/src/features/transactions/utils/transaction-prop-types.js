import PropTypes from 'prop-types';

import accountTransactionPropTypes from './account-transaction-prop-types';
import envelopeTransactionPropTypes from './envelope-transaction-prop-types';
import transactionTypes from './transaction-types';

const propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(transactionTypes).isRequired,
  recordedDate: PropTypes.string.isRequired,
  payee: PropTypes.string.isRequired,
  accountTransactions: PropTypes.arrayOf(accountTransactionPropTypes).isRequired,
  envelopeTransactions: PropTypes.arrayOf(envelopeTransactionPropTypes).isRequired,
});

export default propTypes;
