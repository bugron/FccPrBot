const utils = require('../lib/utils');
const chai = require('chai'),
  expect = chai.expect,
  chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Testing utils', () => {
  describe('Check configuration global object', () => {
    it('Config is an object', () => {
      return expect(utils.configRules).to.be.an('object');
    });
  });
  describe('Check configuration object\'s properties', () => {
    it('github is an object', () => {
      return expect(utils.github).to.be.an('object');
    });
    it('Test camelCase function to be true', () => {
      return expect(utils.camelCase('Infix-Caps', '-')).to.be.true;
    });
    it('Test camelCase function to be false', () => {
      return expect(utils.camelCase('infix Caps', ' ')).to.be.false;
    });
  });
});
