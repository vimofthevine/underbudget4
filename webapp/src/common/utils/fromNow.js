import moment from 'moment';

export default (time) => {
  // 10s before or after
  if (Math.abs(moment().diff(time)) < 10000) {
    return 'just now';
  }
  return time.fromNow();
};
