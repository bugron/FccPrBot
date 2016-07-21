import * as utils from '../lib/utils';
const chai = require('chai'),
  expect = chai.expect,
  chaiAsPromised = require('chai-as-promised');
let githubConfig = {
  user: 'bugron',
  repo: 'FccPrBot',
  number: 4
},
fakeGithubConfig = {
  user: 'bugron',
  repo: 'FccPrBot',
  number: -1
};

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
    it('getFiles is a function', () => {
      return expect(utils.getFiles).to.be.function;
    });
    it('Successful call getFiles function', (done) => {
      utils.getFiles(githubConfig).then((value) => {
        done();
        return expect(value).to.be.an('array');
      });
    });
    it('Fail call getFiles function', () => {
      return expect(utils.getFiles(fakeGithubConfig)).to.be.rejected;
    });
    it('getContent is a function', () => {
      return expect(utils.getContent).to.be.function;
    });
    it('Successful call getContent function', (done) => {
      utils.getContent({
        user: 'bugron',
        repo: 'TestPrBot',
        path: 'file.json',
        ref: 'audit/new-translation'
      }).then((value) => {
        done();
        return expect(value).to.be.an('array');
      });
    });
    it('Fail call getContent function', () => {
      return expect(utils.getContent({
        user: 'bugron',
        repo: 'TestPrBot',
        path: 'file.json1',
        ref: 'audit/new-translation'
      })).to.be.rejected;
    });
    it('getCommits is a function', () => {
      return expect(utils.getCommits).to.be.function;
    });
    it('Successful call getCommits function', (done) => {
      utils.getCommits(githubConfig).then((value) => {
        done();
        return expect(value).to.be.an('array');
      });
    });
    it('Fail call getCommits function', () => {
      return expect(utils.getCommits(fakeGithubConfig)).to.be.rejected;
    });
    it('Test camelCase function to be true', () => {
      return expect(utils.camelCase('Infix-Caps', '-')).to.be.true;
    });
    it('Test camelCase function to be false', () => {
      return expect(utils.camelCase('infix Caps', ' ')).to.be.false;
    });
    it('Call identifyTranslators', () => {
      let data = require('fs')
        .readFileSync('test/files/identifyTranslators.json'),
      translationTeams = {
        Es: ['vtamara', 'justinian336'],
        Ru: ['bugron', 'alnero', 'rfprod'],
        Fr: ['elazzabi', 'fnonga']
      }, translators = [];
      data = JSON.parse(data);
      translators = translators.concat(
        utils.identifyTranslators(data.challenges[1], translationTeams)
      );
      return expect(translators).to.be.instanceof(Array) &&
        expect(translators).to
          .include(...translationTeams['Ru'], ...translationTeams['Es']) &&
        expect(translators).to.not.include(...translationTeams['Fr']);
    });
  });
});
