const { assert } = require('chai');
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
    it('camelCase function to be true', () => {
      return expect(utils.camelCase('Infix-Caps', '-')).to.be.true;
    });
    it('camelCase function to be false', () => {
      return expect(utils.camelCase('infix Caps', ' ')).to.be.false;
    });
    it('getNormalizedRule function to return an object', () => {
      return expect(utils.getNormalizedRule({ rules: { ruleName: 'HelloRule' } }, 'ruleName')).to.be.an('object');
    });
    it('getNormalizedRule function to return a rule', () => {
      assert.deepEqual(utils.getNormalizedRule({ rules: { ruleName: 'HelloRule' } }, 'ruleName'), { value: 'HelloRule' });
    });
    it('getNormalizedRule should throw an error if no repo configuration is provided', () => {
      expect(utils.getNormalizedRule).to.throw('No rules are provided');
    });
  });
});
