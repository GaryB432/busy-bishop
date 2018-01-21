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
  const re = new RegExp(selectedText, 'g');

  function getStartIndices(line: string): StringPosition[] {
    const starts: StringPosition[] = [];
    let arr: RegExpExecArray | null;
    // tslint:disable-next-line
    while ((arr = re.exec(line)) !== null) {
      starts.push({ index: arr.index, line });
    }
    return starts;
  }

  if (isArray(lines)) {
    const linesWith1 = lines
      .map(line => {
        return {
          indices: getStartIndices(line),
          line,
        };
      })
      .filter(lixs => lixs.indices.length === 1);
    const lineWith1 = single(linesWith1);
    if (lineWith1) {
      const singleIndex = single(lineWith1.indices);
      if (singleIndex) {
        if (singleIndex.index > MAX) {
          return wordBreakExpand(
            singleIndex,
            singleIndex.index % MAX,
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

export function occurrences(
  str: string,
  substr: string,
  allowOverlapping: boolean
): number {
  let n = 0;
  let pos = 0;
  const step = allowOverlapping ? 1 : substr.length;

  while (true) {
    pos = str.indexOf(substr, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else {
      break;
    }
  }
  return n;
}
