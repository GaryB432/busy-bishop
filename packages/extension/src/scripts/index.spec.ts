import * as publics from '.';
it('exports', () => {
  expect(publics.background).toBeTruthy();
  expect(publics.content).toBeTruthy();
  expect(publics.dd).toBeTruthy();
  expect(publics.popup).toBeTruthy();
});
