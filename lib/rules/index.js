const repoConfig = require('./repoConfig');
const acceptedActions = require('./acceptedActions');
const synchronizeAction = require('./synchronizeAction');
const ignorePRFromUser = require('./ignorePRFromUser');
const forbiddenUser = require('./forbiddenUser');
const forbiddenBaseBranch = require('./forbiddenBaseBranch');
const forbiddenHeadBranch = require('./forbiddenHeadBranch');
const allowedFileNames = require('./allowedFileNames');
const allowedBranchNames = require('./allowedBranchNames');
const forbiddenTitleKeywords = require('./forbiddenTitleKeywords');
const maxCommitCount = require('./maxCommitCount');

module.exports = [
  repoConfig,
  acceptedActions,
  synchronizeAction,
  ignorePRFromUser,
  forbiddenUser,
  forbiddenBaseBranch,
  forbiddenHeadBranch,
  allowedFileNames,
  allowedBranchNames,
  forbiddenTitleKeywords,
  maxCommitCount,
];
