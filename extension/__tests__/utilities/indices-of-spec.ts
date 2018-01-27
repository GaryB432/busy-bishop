import * as utilities from '../../src/scripts/lib/utilities';

test('should count occurrences', () => {
  expect(utilities.indicesOf('foofoofoo', 'foo', true)).toEqual([0, 3, 6]);
});

test('should count occurrences', () => {
  expect(utilities.indicesOf('foofoofoo', 'bar', true)).toEqual([]);
});

test('should count occurrences', () => {
  expect(utilities.indicesOf('foobarfoo', 'bar', true)).toEqual([3]);
});

test('should count occurrences', () => {
  expect(utilities.indicesOf('bar', 'bar', true)).toEqual([0]);
});
