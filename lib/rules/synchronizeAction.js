const { github } = require('../utils');

/**
 * Handles the 'synchronize' action (new commits are pushed, etc.)
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function synchronizeAction(repoConfig, data) {
  if (data.action === 'synchronize') {
    await github.issues.createComment({
      owner: data.repository.owner.login,
      repo: data.repository.name,
      number: data.pull_request.number,
      body: `@${data.sender.login} updated the pull request.`
    });
    return false;
  }
}
