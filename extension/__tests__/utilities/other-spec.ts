import { URL } from 'url';

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

const href = 'https://banana.com:81/path/stuff?query=you%20%CCbet#other-junk';

test('Should stringify date', () => {
  const m = new Date(2002, 3, 4, 5, 6, 7, 8);
  expect(utilities.dateString(m.getTime())).toEqual('4/4/2002');
});

test('Should verify url parsing', () => {
  const u = new URL(href);
  expect(u.hash).toEqual('#other-junk');
  expect(u.host).toEqual('banana.com:81');
  expect(u.hostname).toEqual('banana.com');
  expect(u.href).toEqual(href);
  expect(u.origin).toEqual('https://banana.com:81');
  expect(u.pathname).toEqual('/path/stuff');
  expect(u.port).toEqual('81');
  expect(u.protocol).toEqual('https:');
  expect(u.search).toEqual('?query=you%20%CCbet');
});

test('Should simplify invalid url', () => {
  expect(
    utilities.simplifyLocation({ hostname: '', pathname: '', search: '' })
  ).toBe('');
  expect(
    utilities.simplifyLocation({ hostname: 'a', pathname: '', search: '' })
  ).toBe('a');
  expect(
    utilities.simplifyLocation({ hostname: '', pathname: 'b', search: '' })
  ).toBe('b');
  expect(
    utilities.simplifyLocation({ hostname: '', pathname: '', search: 'c' })
  ).toBe('c');
  expect(
    utilities.simplifyLocation({ hostname: 'a', pathname: '', search: 'c' })
  ).toBe('ac');
  expect(
    utilities.simplifyLocation({ hostname: '', pathname: 'b', search: 'c' })
  ).toBe('bc');
  expect(
    utilities.simplifyLocation({ hostname: 'a', pathname: '', search: 'c' })
  ).toBe('ac');
});

test('Should simplify url', () => {
  expect(utilities.simplifyLocation(new URL(href))).toBe(
    'banana.com/path/stuff?query=you%20%CCbet'
  );
});
