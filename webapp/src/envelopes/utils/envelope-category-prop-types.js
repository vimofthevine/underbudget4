import PropTypes from 'prop-types';

import EnvelopePropTypes from './envelope-prop-types';

const envelopeCategoryPropTypes = PropTypes.shape({
  envelopes: PropTypes.arrayOf(EnvelopePropTypes).isRequired,
  name: PropTypes.string.isRequired,
});

export default envelopeCategoryPropTypes;
