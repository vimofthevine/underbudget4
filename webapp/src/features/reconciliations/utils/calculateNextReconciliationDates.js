import moment from 'moment';

export default (endingDate) => ({
  beginningDate: moment(endingDate).add(1, 'day').format('YYYY-MM-DD'),
  endingDate: moment(endingDate).add(1, 'month').format('YYYY-MM-DD'),
});
