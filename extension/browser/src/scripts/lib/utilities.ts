import { isArray } from 'util';

type StringNumberTuple = [string, number];

type ElementPath = StringNumberTuple[];

interface StringPosition {
  line: string;
  index: number;
}

function separateLines(lines: string): string[] {
  return lines.split('\n');
}

export function narrowSelectionContext(
  lines: string | string[],
  selectedText: string
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
        return { line: lineWith1.line, index: singleIndex.index };
      }
    }
  } else {
    return narrowSelectionContext(separateLines(lines), selectedText);
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
