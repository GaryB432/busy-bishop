// module.exports = {
//   name: 'ui',
//   displayName: 'ui',

//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   // testPathIgnorePatterns: ['/node_modules/', '/output/'],
//   globals: {
//     skipBabel: true
//   },

//   // NOTE: if you don't set this correctly then when you reference
//   // it later in a path string you'll get a confusing error message.
//   // It says something like' Module <rootDir>/config/polyfills.js in
//   // the setupFiles option was not found.'
//   rootDir: './../../',

//   testMatch: [
//     "<rootDir>/src/server/**/__tests__/*.unit.{js,jsx}",
//     "<rootDir>/src/server/**/__tests__/unit/*.{js,jsx}"
//   ],

//   // etc...
// };
// module.exports = {
//   preset: 'ts-jest',
//   name: 'bar',
//   testEnvironment: 'jsdom',
//   displayName: 'bar',
//   // rootDir: './',
//   globals: {
//     skipBabel: true
//   }
// };

module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};