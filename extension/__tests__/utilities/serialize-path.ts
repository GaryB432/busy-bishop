import * as utilities from '../../src/scripts/lib/utilities';

test('Should serialize path', () => {
  expect(
    utilities.serializePath([
      ['BODY', 1],
      ['BFAM-ROOT', 0],
      ['MAIN', 1],
      ['BFAM-GARY', 1],
      ['BFAM-OVERVIEW', 1],
      ['DIV', 0],
      ['SECTION', 0],
      ['ARTICLE', 5],
      ['P', 1],
    ])
  ).toEqual(
    'BODY 1 BFAM-ROOT 0 MAIN 1 BFAM-GARY 1 BFAM-OVERVIEW 1 DIV 0 SECTION 0 ARTICLE 5 P 1'
  );
});

xtest('Should deserialize path', () => {
  expect(
    utilities.deserializePath(
      'BODY 1 BFAM-ROOT 0 MAIN 1 BFAM-GARY 1 BFAM-OVERVIEW 1 DIV 0 SECTION 0 ARTICLE 5 P 1'
    )
  ).toEqual([
    ['BODY', 1],
    ['BFAM-ROOT', 0],
    ['MAIN', 1],
    ['BFAM-GARY', 1],
    ['BFAM-OVERVIEW', 1],
    ['DIV', 0],
    ['SECTION', 0],
    ['ARTICLE', 5],
    ['P', 1],
  ]);
});
