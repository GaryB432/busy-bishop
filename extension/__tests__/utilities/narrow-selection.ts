import * as utilities from '../../src/scripts/lib/utilities';

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

const humanFactors = 'human factors';
const intuition = 'intuition';

const sixLines = `The interesting thing about diff algorithms is that they’re a mix of computer
science and human factors. There are many equally good diffs between two files,
judging them by the length of the edit sequence, and choosing between them
requires an algorithm that can best match people’s intuition about how their
code has changed.`;

test('should expand word wrap', () => {
  const res = utilities.wordBreakExpand(
    { line: 'the best ever found text is here dont you think?', index: 20 },
    6,
    24
  );
  expect(res.line).toBe('best ever found text is here');
  expect(res.index).toBe(16);
  expect(res.line.substr(res.index, 4)).toBe('text');
});

test('Should get legit multi-line', () => {
  const res = utilities.narrowSelectionContext(sixLines, humanFactors)!;
  expect(res).not.toBeNull();
  expect(res.line).toEqual(
    'science and human factors. There are many equally good diffs between two files,'
  );
  expect(res.line.substr(res.index, humanFactors.length)).toEqual(humanFactors);
});

const longLine = `The interesting thing about diff algorithms is that they’re a mix of computer science and human factors. There are many equally good diffs between two files, judging them by the length of the edit sequence, and choosing between them requires an algorithm that can best match people’s intuition about how their code has changed.`;

test('Should get long line', () => {
  const res = utilities.narrowSelectionContext(longLine, intuition, 50)!;
  expect(res).not.toBeNull();
  expect(res.line).toEqual(
    'requires an algorithm that can best match people’s intuition about how their code has changed.'
  );
  expect(res.line.substr(res.index, intuition.length)).toBe(intuition);
});
