import { parse, Url } from 'url';
import { isArray } from 'util';

type StringNumberTuple = [string, number];

type ElementPath = StringNumberTuple[];

/**
 * Represents a position in a string.
 * { line:'abcde', index: 2 } indicates the 'c'
 */
export interface StringPosition {
  line: string;
  index: number;
}

function separateLines(lines: string): string[] {
  return lines.split('\n');
}

export function getStartIndices(
  line: string,
  substr: string
): StringPosition[] {
  const re = new RegExp(substr, 'g');
  const starts: StringPosition[] = [];
  let arr: RegExpExecArray | null;
  while ((arr = re.exec(line)) !== null) {
    starts.push({ index: arr.index, line });
  }
  return starts;
}

export function wordBreakExpand(
  subject: StringPosition,
  start: number,
  len: number
): StringPosition {
  while (start > 0 && subject.line.charAt(start - 1) !== ' ') {
    start--;
    len++;
  }
  while (
    len + start < subject.line.length &&
    subject.line.charAt(len + start) !== ' '
  ) {
    len++;
  }
  const line = subject.line.substr(start, len);
  const index = subject.index - start;
  return { line, index };
}

export function narrowSelectionContext(
  lines: string | string[],
  selectedText: string,
  MAX: number = 100
): StringPosition | null {
  if (isArray(lines)) {
    const linesWith1 = lines
      .map(line => {
        return {
          indices: getStartIndices(line, selectedText),
          line,
        };
      })
      .filter(lixs => lixs.indices.length === 1);
    const lineWith1 = single(linesWith1);
    if (lineWith1) {
      const singleIndex = single(lineWith1.indices);
      if (singleIndex) {
        // console.log(singleIndex.index);
        // if (singleIndex.index > MAX) {
        //   const ll = singleIndex.line.substr(singleIndex.index - MAX, selectedText.length + (MAX * 2));
        //   const nd = MAX;
        //   // return wordBreakExpand({ index: nd, line: ll }, selectedText.length)
        //   const sp: StringPosition = { index: nd, line: ll };
        //   console.log(sp);
        //   return sp;
        // }
        if (singleIndex.index > MAX) {
          return wordBreakExpand(
            singleIndex,
            singleIndex.index - MAX,
            MAX * 2 + selectedText.length
          );
        }
        return singleIndex;
      }
    }
  } else {
    return narrowSelectionContext(separateLines(lines), selectedText, MAX);
  }
  return null;
}

export function single<T>(sub: T[]): T | undefined {
  return sub.length === 1 ? sub[0] : undefined;
}

export function serializePath(elementPath: ElementPath): string {
  return elementPath.map(ep => `${ep[0]} ${ep[1]}`).join(' ');
}

export function deserializePath(_str: string): ElementPath {
  throw new Error('not yet implemented');
}

export function dateString(ticks: number): string {
  const date = new Date(ticks);
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return `${m + 1}/${d}/${y}`;
}

export function indicesOf(
  str: string,
  substr: string,
  allowOverlapping: boolean
): number[] {
  const starts: number[] = [];
  let pos = 0;
  const step = allowOverlapping ? 1 : substr.length;

  while (true) {
    pos = str.indexOf(substr, pos);
    if (pos >= 0) {
      starts.push(pos);
      pos += step;
    } else {
      break;
    }
  }
  return starts;
}

export function cleanLocation(location: Url | string): string {
  // hash: omitted
  // host: using hostname which exludes port
  // hostname: check
  // href: skipping for constituents
  // origin: skipping for constituents
  // pathname: check
  // port: omitting by using hostname
  // protocol: omitted;
  // search: check;

  function main(loc: Url) {
    const search = loc.search
      ? loc.search.replace(/[?&]utm_[^?&]+/g, '').replace(/^&/, '?')
      : '';
    const hostname = loc.hostname || '';
    const pathname = loc.pathname || '';
    return hostname.concat(pathname).concat(search);
  }
  return typeof location === 'string' ? main(parse(location)) : main(location);
}
