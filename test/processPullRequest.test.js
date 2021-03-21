const processPullRequest = require('../lib/processPullRequest');
const chai = require('chai'),
  expect = chai.expect,
  chaiAsPromised = require('chai-as-promised'),
  fs = require('fs'),
  path = require('path');

chai.use(chaiAsPromised);

function getFile(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '/files/', filename))
  );
}

function runTest(data, done) {
  data = getFile(data);
  processPullRequest(data).then((value) => {
    done();
    return expect(value).to.be.undefined;
  });
}

describe('Testing processPullRequest', () => {
  it('Check if processPullRequest is a function', () => {
    return expect(processPullRequest).to.be.function;
  });
  it('Call processPullRequest: reopened', (done) => {
    runTest('reopened.json', done);
  });
  it('Call processPullRequest: closed', (done) => {
    runTest('closed.json', done);
  });
  it('Call processPullRequest: synchronize', (done) => {
    runTest('synchronize.json', done);
  });
  it('Call processPullRequest: invalidRepoName', (done) => {
    runTest('invalidRepoName.json', done);
  });
  it('Call processPullRequest: invalidUserName', (done) => {
    runTest('invalidUserName.json', done);
  });
  it('Call processPullRequest: invalidBaseBranchName', (done) => {
    runTest('invalidBaseBranchName.json', done);
  });
  it('Call processPullRequest: invalidHeadBranchName', (done) => {
    runTest('invalidHeadBranchName.json', done);
  });
  it('Call processPullRequest: invalidCommitMessage', (done) => {
    runTest('invalidCommitMessage.json', done);
  });
});
