import * as utilities from '../src/scripts/lib/utilities';

const someString = 'That is a string';
const otherString = 'Those are strings';

describe('Should return null', () => {
  test('empty array', () => {
    expect(utilities.narrowSelectionContext([], 'is')).toBeNull();
  });
  test('other string', () => {
    expect(utilities.narrowSelectionContext(otherString, 'is')).toBeNull();
  });
  test('other array', () => {
    expect(
      utilities.narrowSelectionContext(['a', otherString, 'c'], 'is')
    ).toBeNull();
  });
  test('twice in array', () => {
    expect(
      utilities.narrowSelectionContext(
        ['a', otherString, 'c', otherString],
        'is'
      )
    ).toBeNull();
  });
  test('twice in string', () => {
    expect(
      utilities.narrowSelectionContext(
        ['a', someString + someString, 'c', otherString],
        'is'
      )
    ).toBeNull();
  });
});

test('Should get string', () => {
  expect(utilities.narrowSelectionContext(someString, 'is')).toEqual({
    index: 5,
    line: someString,
  });
});

test('Should get identity', () => {
  expect(utilities.narrowSelectionContext(someString, someString)).toEqual({
    index: 0,
    line: someString,
  });
});

test('Should get array', () => {
  expect(utilities.narrowSelectionContext([someString], 'is')).toEqual({
    index: 5,
    line: someString,
  });
});

test('Should get array 2', () => {
  const j = ['other', someString, 'stuff'];
  expect(utilities.narrowSelectionContext(j, 'is')).toEqual({
    index: 5,
    line: someString,
  });
});

test('Should get multi-line', () => {
  const j = ['other', someString, 'stuff'];
  expect(utilities.narrowSelectionContext(j.join('\n'), 'is')).toEqual({
    index: 5,
    line: someString,
  });
});

const sut =
  'The interesting thing about diff algorithms is that they’re a mix of computer\nscience and human factors. There are many equally good diffs between two files,\njudging them by the length of the edit sequence, and choosing between them\nrequires an algorithm that can best match people’s intuition about how their\ncode has changed.';

test('Should get legit multi-line', () => {
  expect(utilities.narrowSelectionContext(sut, 'human factors')).toEqual({
    index: 12,
    line:
      'science and human factors. There are many equally good diffs between two files,',
  });
});
