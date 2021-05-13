import PropTypes from 'prop-types';

const propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  accountId: PropTypes.number.isRequired,
  memo: PropTypes.string.isRequired,
  cleared: PropTypes.bool.isRequired,
  amount: PropTypes.number.isRequired,
});

export default propTypes;
