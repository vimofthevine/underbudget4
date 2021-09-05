import PropTypes from 'prop-types';

const propTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  envelopeId: PropTypes.number.isRequired,
  memo: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
});

export default propTypes;
