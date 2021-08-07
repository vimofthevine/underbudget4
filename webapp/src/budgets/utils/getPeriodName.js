import moment from 'moment';

const startOfYear = '1970-01-01';

export default (period, periods) => {
  if (period < 0 || period >= periods) {
    return 'Invalid period';
  }
  if (periods === 52) {
    const start = moment(startOfYear).add(period, 'weeks').format('MMM D');
    const stop = moment(startOfYear)
      .add(period + 1, 'weeks')
      .subtract(1, 'day')
      .format('MMM D');
    return `${start} to ${stop}`;
  }
  if (periods === 26) {
    const start = moment(startOfYear)
      .add(period * 2, 'weeks')
      .format('MMM D');
    const stop = moment(startOfYear)
      .add((period + 1) * 2, 'weeks')
      .subtract(1, 'day')
      .format('MMM D');
    return `${start} to ${stop}`;
  }
  if (periods === 24) {
    const month = moment(startOfYear).add(Math.floor(period / 2), 'months');
    const monthName = month.format('MMM');
    if (period % 2 == 0) {
      return `${monthName} 1 to ${monthName} 15`;
    }
    return `${monthName} 16 to ${monthName} ${month.daysInMonth()}`;
  }
  if (periods === 12) {
    return moment(startOfYear).add(period, 'months').format('MMMM');
  }
  if (periods === 6) {
    const start = moment(startOfYear)
      .add(period * 2, 'months')
      .format('MMM');
    const stop = moment(startOfYear)
      .add(period * 2 + 1, 'months')
      .format('MMM');
    return `${start}/${stop}`;
  }
  if (periods === 4) {
    const start = moment(startOfYear)
      .add(period * 3, 'months')
      .format('MMM');
    const stop = moment(startOfYear)
      .add(period * 3 + 2, 'months')
      .format('MMM');
    return `${start} to ${stop}`;
  }
  if (periods === 3) {
    const start = moment(startOfYear)
      .add(period * 4, 'months')
      .format('MMM');
    const stop = moment(startOfYear)
      .add(period * 4 + 3, 'months')
      .format('MMM');
    return `${start} to ${stop}`;
  }
  if (periods === 2) {
    const start = moment(startOfYear)
      .add(period * 6, 'months')
      .format('MMM');
    const stop = moment(startOfYear)
      .add(period * 6 + 5, 'months')
      .format('MMM');
    return `${start} to ${stop}`;
  }
  if (periods === 1) {
    return 'Jan to Dec';
  }
  return 'Invalid period type';
};
