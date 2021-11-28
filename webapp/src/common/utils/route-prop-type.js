import PropTypes from 'prop-types';

const routeProps = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  PropTypes.func,
]);

export default routeProps;
