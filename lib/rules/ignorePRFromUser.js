/**
 * Ignores PR opened by the specified user
 * Since false is returned no other actions will be executed on the PR
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function ignorePRFromUser(repoConfig, data) {
  if (
    repoConfig.userBlacklistForPR &&
    repoConfig.userBlacklistForPR
      .includes(data.pull_request.user.login)
  ) {
    console.log(`A blacklisted user ${data.action} this PR. Skipping.`);
    return false;
  }
}
