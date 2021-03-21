const { github } = require('../utils');

/**
 * Makes sure that the user who opened the PR is allowed that action
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function forbiddenUser(repoConfig, data) {
  if (repoConfig.userForbiddenForPR) {
    let msg = '';

    if (
      repoConfig.userForbiddenForPR.includes('*') &&
      repoConfig.closeAllPRsMessage
    ) {
      msg = `Dear @${data.pull_request.user.login}.\n` +
        repoConfig.closeAllPRsMessage + ' Thanks.';
    } else if (repoConfig.userForbiddenForPR.includes(data.pull_request.user.login)) {
      msg = `@${data.pull_request.user.login}, ` +
      'unfortunately you\'re not allowed to open PRs in this repository.' +
      ' Closing this PR.';
    }

    if (msg) {
      const githubConfig = {
        owner: data.repository.owner.login,
        repo: data.repository.name,
      };

      await github.issues.createComment({
        ...githubConfig,
        body: msg,
        issue_number: data.pull_request.number
      });

      await github.pulls.update({
        ...githubConfig,
        state: 'closed',
        pull_number: data.pull_request.number
      });

      return false;
    }
  }
}
