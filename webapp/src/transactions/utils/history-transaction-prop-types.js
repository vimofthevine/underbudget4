import PropTypes from 'prop-types';

import transactionTypes from './transaction-types';

const propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  transactionId: PropTypes.number.isRequired,
  type: PropTypes.oneOf(transactionTypes).isRequired,
  recordedDate: PropTypes.string.isRequired,
  payee: PropTypes.string.isRequired,
  memo: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  cleared: PropTypes.bool,
});

export default propTypes;
