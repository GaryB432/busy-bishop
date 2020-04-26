import { add, greet } from '../src';

describe('@busy-bishop/hosted-functions module', () => {
  it('should add', () => {
    expect(add(2, 3)).toEqual(5);
  });
  it('should greet', () => {
    expect(greet('world')).toEqual('@busy-bishop/hosted-functions says: hello to world');
  });
});
