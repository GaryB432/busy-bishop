import { parse } from 'url';

import * as utilities from '../../src/scripts/lib/utilities';

const searchParams = [
  'utm_content=nope',
  'ok=you-bet',
  'utm_medium=nope',
  'utm_source=nope.com',
  'utm_arbitrary=nevah',
  'utm_campaign=nope',
];

const href = `https://banana.com:81/path/stuff?${searchParams.join(
  '&'
)}#other-junk`;

test('Should stringify date', () => {
  const m = new Date(2002, 3, 4, 5, 6, 7, 8);
  expect(utilities.dateString(m.getTime())).toEqual('4/4/2002');
});

test('Should verify url parsing', () => {
  const u = parse(href);
  expect(u.hash).toEqual('#other-junk');
  expect(u.host).toEqual('banana.com:81');
  expect(u.hostname).toEqual('banana.com');
  expect(u.href).toEqual(href);
  expect(u.pathname).toEqual('/path/stuff');
  expect(u.port).toEqual('81');
  expect(u.protocol).toEqual('https:');
  expect(u.search).toEqual(
    '?utm_content=nope&ok=you-bet&utm_medium=nope&utm_source=nope.com&utm_arbitrary=nevah&utm_campaign=nope'
  );
});

test('Should simplify invalid url', () => {
  expect(
    utilities.cleanLocation({ hostname: '', pathname: '', search: '' })
  ).toBe('');
  expect(
    utilities.cleanLocation({ hostname: 'a', pathname: '', search: '' })
  ).toBe('a');
  expect(
    utilities.cleanLocation({ hostname: '', pathname: 'b', search: '' })
  ).toBe('b');
  expect(
    utilities.cleanLocation({ hostname: '', pathname: '', search: 'c' })
  ).toBe('c');
  expect(
    utilities.cleanLocation({ hostname: 'a', pathname: '', search: 'c' })
  ).toBe('ac');
  expect(
    utilities.cleanLocation({ hostname: '', pathname: 'b', search: 'c' })
  ).toBe('bc');
  expect(
    utilities.cleanLocation({ hostname: 'a', pathname: '', search: 'c' })
  ).toBe('ac');
});

test('Should simplify url', () => {
  expect(utilities.cleanLocation(parse(href))).toBe(
    'banana.com/path/stuff?ok=you-bet'
  );
});

test('Should simplify stringy url', () => {
  expect(utilities.cleanLocation(href)).toBe(
    'banana.com/path/stuff?ok=you-bet'
  );
});
