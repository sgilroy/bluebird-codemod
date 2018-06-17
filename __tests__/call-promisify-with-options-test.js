const defineTest = require('jscodeshift/dist/testUtils').defineTest;
describe('call-promisify-with-options', () => {
  defineTest(__dirname, 'call-promisify-with-options');
});
