import React from 'react';

import useNavigateKeepingSearch from '../../hooks/useNavigateKeepingSearch';
import routePropType from '../../utils/route-prop-type';
import LeftIconButton from './LeftIconButton';

const NavIconButton = ({ dest, ...props }) => {
  const navigate = useNavigateKeepingSearch();
  return (
    <LeftIconButton
      {...props}
      onClick={() => navigate(typeof dest === 'function' ? dest() : dest)}
    />
  );
};

NavIconButton.propTypes = {
  ...LeftIconButton.propTypes,
  dest: routePropType.isRequired,
};

export default NavIconButton;
