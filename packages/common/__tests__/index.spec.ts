import { add, greet } from '../src';

describe('@busy-bishop/common module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual('@busy-bishop/common says: hello to world');
  });
});
