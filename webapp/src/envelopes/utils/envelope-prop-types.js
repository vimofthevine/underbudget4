import PropTypes from 'prop-types';

const envelopePropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export default envelopePropTypes;
