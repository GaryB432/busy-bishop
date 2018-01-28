import { SuggestionDocument } from './models';

export type Href = string;

export function reduceByLocation(
  suggestions: Array<Partial<SuggestionDocument>>
): Map<Href, Array<Partial<SuggestionDocument>>> {
  const result = suggestions.reduce<
    Map<Href, Array<Partial<SuggestionDocument>>>
  >((mapp, sugg) => {
    if (!!sugg.location) {
      if (!mapp.has(sugg.location)) {
        mapp.set(sugg.location, []);
      }
      const hsuggs = mapp.get(sugg.location)!;
      hsuggs.push(sugg);
    }
    return mapp;
  }, new Map());
  return result;
}

// const funStuff: SuggestionDocument[] = [
//   {
//     context:
//       ', click the browser action button to see a list of the suggestions. Make any changes\n            you choose to your documents and publish them the normal way. Simple.\n          ',
//     createdAt: 1514402425728,
//     elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 8',
//     href: 'https://garyb432.github.io/busy-bishop/',
//     id: '7442ea64-5528-409e-80ce-d2fff8d9d6d6',
//     selectedText: 'browser',
//     selectionStart: 12,
//     suggestedText: 'extension',
//     textNodeIndex: 2,
//   },
//   {
//     context:
//       "\n            Select a small amount of text containing the mistake you'd like to correct. Its simple. Just select\n            ",
//     createdAt: 1514402490477,
//     elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 4',
//     href: 'https://garyb432.github.io/busy-bishop/',
//     id: 'ff15bfd5-af48-4f45-9221-90c583ba0b07',
//     selectedText: 'Its',
//     selectionStart: 89,
//     suggestedText: "It's",
//     textNodeIndex: 0,
//   },
//   {
//     context:
//       "\n            Select a small amount of text containing the mistake you'd like to correct. Its simple. Just select\n            ",
//     createdAt: 1514402842233,
//     elementPath: 'BODY 1 DIV 0 DIV 0 MAIN 2 DIV 0 DIV 1 P 4',
//     href: 'https://garyb432.github.io/busy-bishop/',
//     id: '219ffdb3-3ea0-47c6-9b28-725a66f5a343',
//     selectedText: 'small',
//     selectionStart: 22,
//     suggestedText: 'minute',
//     textNodeIndex: 0,
//   },
// ];
