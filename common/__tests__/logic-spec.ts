import 'jest';

import * as logic from '../src/logic';
import { SuggestionDocument } from '../src/models';

test('Should reduce', () => {
  const suggs = [
    {
      location: 'href0',
      id: 'id0',
    },
    {
      location: 'href1',
      id: 'id1',
    },
    {
      location: 'href1',
      id: 'id2',
    },
    {
      location: 'href3',
      id: 'id3',
    },
    {
      location: 'href4',
      id: 'id4',
    },
  ];

  const mapp = logic.reduceByLocation(suggs);
  expect(mapp.get('href1')).toEqual([
    {
      location: 'href1',
      id: 'id1',
    },
    {
      location: 'href1',
      id: 'id2',
    },
  ]);
});
