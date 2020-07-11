import getApiToken from './getApiToken';

export default () => ({
  Authorization: `Bearer ${getApiToken()}`,
});
