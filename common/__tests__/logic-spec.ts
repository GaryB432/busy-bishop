import 'jest';

import * as index from '../src/logic';
import { SuggestionDocument } from '../src/models';

test('Should reduce', () => {
  const suggs = [
    {
      href: 'href0',
      id: 'id0',
    },
    {
      href: 'href1',
      id: 'id1',
    },
    {
      href: 'href1',
      id: 'id2',
    },
    {
      href: 'href3',
      id: 'id3',
    },
    {
      href: 'href4',
      id: 'id4',
    },
  ];

  const mapp = index.reduceByHref(suggs);
  expect(mapp.get('href1')).toEqual([
    {
      href: 'href1',
      id: 'id1',
    },
    {
      href: 'href1',
      id: 'id2',
    },
  ]);
});
