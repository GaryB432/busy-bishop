import * as utilities from '../../src/scripts/lib/utilities';

test('should count occurrences', () => {
  expect(utilities.occurrences('foofoofoo', 'foo', true)).toBe(3);
});

test('should count occurrences', () => {
  expect(utilities.occurrences('foofoofoo', 'bar', true)).toBe(0);
});

test('should count occurrences', () => {
  expect(utilities.occurrences('foobarfoo', 'bar', true)).toBe(1);
});

test('should count occurrences', () => {
  expect(utilities.occurrences('bar', 'bar', true)).toBe(1);
});
