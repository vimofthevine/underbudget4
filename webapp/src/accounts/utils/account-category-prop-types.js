import PropTypes from 'prop-types';

import AccountPropTypes from './account-prop-types';

const accountCategoryPropTypes = PropTypes.shape({
  accounts: PropTypes.arrayOf(AccountPropTypes).isRequired,
  name: PropTypes.string.isRequired,
});

export default accountCategoryPropTypes;
