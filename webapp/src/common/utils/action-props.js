import PropTypes from 'prop-types';

const actionProps = PropTypes.shape({
  'aria-label': PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  fabIcon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
});

export default actionProps;
