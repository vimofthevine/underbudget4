const authErrorCodes = [401, 403];

const retry = (failureCount, error) => {
  if (typeof error === 'object') {
    if (error.response && authErrorCodes.includes(error.response.status)) {
      return false;
    }
  }

  return failureCount <= 3;
};

export default {
  retry,
};
