const repoConfig = require('./repoConfig');
const acceptedActions = require('./acceptedActions');
const synchronizeAction = require('./synchronizeAction');
const ignorePRFromUser = require('./ignorePRFromUser');
const forbiddenUser = require('./forbiddenUser');
const forbiddenBaseBranchPatterns = require('./forbiddenBaseBranchPatterns');
const forbiddenHeadBranchPatterns = require('./forbiddenHeadBranchPatterns');
const allowedFileNamePatterns = require('./allowedFileNamePatterns');
const allowedHeadBranchPatterns = require('./allowedHeadBranchPatterns');
const forbiddenTitleKeywords = require('./forbiddenTitleKeywords');
const maxCommitCount = require('./maxCommitCount');

module.exports = [
  repoConfig,
  acceptedActions,
  synchronizeAction,
  ignorePRFromUser,
  forbiddenUser,
  forbiddenBaseBranchPatterns,
  forbiddenHeadBranchPatterns,
  allowedFileNamePatterns,
  allowedHeadBranchPatterns,
  forbiddenTitleKeywords,
  maxCommitCount,
];
