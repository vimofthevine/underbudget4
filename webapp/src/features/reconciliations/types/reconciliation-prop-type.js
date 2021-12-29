import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  accountId: PropTypes.number.isRequired,
  beginningBalance: PropTypes.number.isRequired,
  beginningDate: PropTypes.string.isRequired,
  endingBalance: PropTypes.number.isRequired,
  endingDate: PropTypes.string.isRequired,
});
