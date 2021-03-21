/**
 * Checks if repository configuration exists
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function repoConfig(repoConfig, data) {
  if (!repoConfig && typeof repoConfig === 'undefined') {
    console.log(`${data.pull_request.base.repo.full_name} is not listed in rules configuration file. Skipping.`);
    return false;
  }
}
