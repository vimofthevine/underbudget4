import PropTypes from 'prop-types';

const ledgerPropTypes = PropTypes.shape({
  // This is coming from the backend API, we don't really care if it's an int or a UUID
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  currency: PropTypes.number.isRequired,
  lastUpdated: PropTypes.string.isRequired,
});

export default ledgerPropTypes;
