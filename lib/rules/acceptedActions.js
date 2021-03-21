/**
 * Makes sure that only allowed webhook actions are processed
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function acceptedActions(repoConfig, data) {
  if (
    repoConfig.actions &&
    !repoConfig.actions.includes(data.action)
  ) {
    console.log(
      'Skipping because action is ' + data.action + '.',
      'We only care about: \'' + repoConfig.actions.join("', '") + '\''
    );
    return false;
  }
}
