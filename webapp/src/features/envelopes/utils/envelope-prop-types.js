import PropTypes from 'prop-types';

const envelopePropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

export default envelopePropTypes;
