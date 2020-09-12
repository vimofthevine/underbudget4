import PropTypes from 'prop-types';

const accountPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export default accountPropTypes;
