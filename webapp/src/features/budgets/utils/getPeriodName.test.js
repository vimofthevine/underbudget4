import getPeriodName from './getPeriodName';

test('should use date range for weekly periods', () => {
  expect(getPeriodName(0, 52)).toBe('Jan 1 to Jan 7');
  expect(getPeriodName(1, 52)).toBe('Jan 8 to Jan 14');
  expect(getPeriodName(2, 52)).toBe('Jan 15 to Jan 21');
  expect(getPeriodName(3, 52)).toBe('Jan 22 to Jan 28');
  expect(getPeriodName(4, 52)).toBe('Jan 29 to Feb 4');

  expect(getPeriodName(30, 52)).toBe('Jul 30 to Aug 5');
  expect(getPeriodName(31, 52)).toBe('Aug 6 to Aug 12');
  expect(getPeriodName(32, 52)).toBe('Aug 13 to Aug 19');
  expect(getPeriodName(33, 52)).toBe('Aug 20 to Aug 26');
  expect(getPeriodName(34, 52)).toBe('Aug 27 to Sep 2');

  expect(getPeriodName(47, 52)).toBe('Nov 26 to Dec 2');
  expect(getPeriodName(48, 52)).toBe('Dec 3 to Dec 9');
  expect(getPeriodName(49, 52)).toBe('Dec 10 to Dec 16');
  expect(getPeriodName(50, 52)).toBe('Dec 17 to Dec 23');
  expect(getPeriodName(51, 52)).toBe('Dec 24 to Dec 30');

  expect(getPeriodName(-1, 52)).toBe('Invalid period');
  expect(getPeriodName(52, 52)).toBe('Invalid period');
});

test('should use date range for biweekly periods', () => {
  expect(getPeriodName(0, 26)).toBe('Jan 1 to Jan 14');
  expect(getPeriodName(1, 26)).toBe('Jan 15 to Jan 28');
  expect(getPeriodName(2, 26)).toBe('Jan 29 to Feb 11');
  expect(getPeriodName(3, 26)).toBe('Feb 12 to Feb 25');
  expect(getPeriodName(4, 26)).toBe('Feb 26 to Mar 11');

  expect(getPeriodName(14, 26)).toBe('Jul 16 to Jul 29');
  expect(getPeriodName(15, 26)).toBe('Jul 30 to Aug 12');
  expect(getPeriodName(16, 26)).toBe('Aug 13 to Aug 26');
  expect(getPeriodName(17, 26)).toBe('Aug 27 to Sep 9');
  expect(getPeriodName(18, 26)).toBe('Sep 10 to Sep 23');

  expect(getPeriodName(21, 26)).toBe('Oct 22 to Nov 4');
  expect(getPeriodName(22, 26)).toBe('Nov 5 to Nov 18');
  expect(getPeriodName(23, 26)).toBe('Nov 19 to Dec 2');
  expect(getPeriodName(24, 26)).toBe('Dec 3 to Dec 16');
  expect(getPeriodName(25, 26)).toBe('Dec 17 to Dec 30');

  expect(getPeriodName(-1, 26)).toBe('Invalid period');
  expect(getPeriodName(26, 26)).toBe('Invalid period');
});

test('should use date range for semimonthly periods', () => {
  expect(getPeriodName(0, 24)).toBe('Jan 1 to Jan 15');
  expect(getPeriodName(1, 24)).toBe('Jan 16 to Jan 31');
  expect(getPeriodName(2, 24)).toBe('Feb 1 to Feb 15');
  expect(getPeriodName(3, 24)).toBe('Feb 16 to Feb 28');
  expect(getPeriodName(4, 24)).toBe('Mar 1 to Mar 15');

  expect(getPeriodName(10, 24)).toBe('Jun 1 to Jun 15');
  expect(getPeriodName(11, 24)).toBe('Jun 16 to Jun 30');
  expect(getPeriodName(12, 24)).toBe('Jul 1 to Jul 15');
  expect(getPeriodName(13, 24)).toBe('Jul 16 to Jul 31');
  expect(getPeriodName(14, 24)).toBe('Aug 1 to Aug 15');

  expect(getPeriodName(19, 24)).toBe('Oct 16 to Oct 31');
  expect(getPeriodName(20, 24)).toBe('Nov 1 to Nov 15');
  expect(getPeriodName(21, 24)).toBe('Nov 16 to Nov 30');
  expect(getPeriodName(22, 24)).toBe('Dec 1 to Dec 15');
  expect(getPeriodName(23, 24)).toBe('Dec 16 to Dec 31');

  expect(getPeriodName(-1, 24)).toBe('Invalid period');
  expect(getPeriodName(24, 24)).toBe('Invalid period');
});

test('should use month name for monthly periods', () => {
  expect(getPeriodName(0, 12)).toBe('January');
  expect(getPeriodName(1, 12)).toBe('February');
  expect(getPeriodName(2, 12)).toBe('March');
  expect(getPeriodName(3, 12)).toBe('April');
  expect(getPeriodName(4, 12)).toBe('May');
  expect(getPeriodName(5, 12)).toBe('June');
  expect(getPeriodName(6, 12)).toBe('July');
  expect(getPeriodName(7, 12)).toBe('August');
  expect(getPeriodName(8, 12)).toBe('September');
  expect(getPeriodName(9, 12)).toBe('October');
  expect(getPeriodName(10, 12)).toBe('November');
  expect(getPeriodName(11, 12)).toBe('December');

  expect(getPeriodName(-1, 12)).toBe('Invalid period');
  expect(getPeriodName(12, 12)).toBe('Invalid period');
});

test('should use month range for bimonthly periods', () => {
  expect(getPeriodName(0, 6)).toBe('Jan/Feb');
  expect(getPeriodName(1, 6)).toBe('Mar/Apr');
  expect(getPeriodName(2, 6)).toBe('May/Jun');
  expect(getPeriodName(3, 6)).toBe('Jul/Aug');
  expect(getPeriodName(4, 6)).toBe('Sep/Oct');
  expect(getPeriodName(5, 6)).toBe('Nov/Dec');

  expect(getPeriodName(-1, 6)).toBe('Invalid period');
  expect(getPeriodName(6, 6)).toBe('Invalid period');
});

test('should use month range for quarterly periods', () => {
  expect(getPeriodName(0, 4)).toBe('Jan to Mar');
  expect(getPeriodName(1, 4)).toBe('Apr to Jun');
  expect(getPeriodName(2, 4)).toBe('Jul to Sep');
  expect(getPeriodName(3, 4)).toBe('Oct to Dec');

  expect(getPeriodName(-1, 4)).toBe('Invalid period');
  expect(getPeriodName(4, 4)).toBe('Invalid period');
});

test('should use month range for triannual periods', () => {
  expect(getPeriodName(0, 3)).toBe('Jan to Apr');
  expect(getPeriodName(1, 3)).toBe('May to Aug');
  expect(getPeriodName(2, 3)).toBe('Sep to Dec');

  expect(getPeriodName(-1, 3)).toBe('Invalid period');
  expect(getPeriodName(3, 3)).toBe('Invalid period');
});

test('should use month range for biannual periods', () => {
  expect(getPeriodName(0, 2)).toBe('Jan to Jun');
  expect(getPeriodName(1, 2)).toBe('Jul to Dec');

  expect(getPeriodName(-1, 2)).toBe('Invalid period');
  expect(getPeriodName(2, 2)).toBe('Invalid period');
});

test('should use month range for annual periods', () => {
  expect(getPeriodName(0, 1)).toBe('Jan to Dec');

  expect(getPeriodName(-1, 1)).toBe('Invalid period');
  expect(getPeriodName(1, 1)).toBe('Invalid period');
});

test('should reject invalid period types', () => {
  expect(getPeriodName(0, -1)).toBe('Invalid period');
  expect(getPeriodName(0, 0)).toBe('Invalid period');
  expect(getPeriodName(0, 5)).toBe('Invalid period type');
  expect(getPeriodName(0, 20)).toBe('Invalid period type');
});
