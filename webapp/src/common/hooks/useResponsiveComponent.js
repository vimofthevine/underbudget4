import useMobile from './useMobile';

export default ({ desktop, mobile }) => {
  const isMobile = useMobile();
  return isMobile ? mobile : desktop;
};
