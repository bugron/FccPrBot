const { getNormalizedRule } = require('../utils');

/**
 * Asserts that the PR is opened against an allowed base branch
 * Note that this check is critical meaning if it is satistfied the PR will be closed
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function forbiddenBaseBranchPatterns(repoConfig, data) {
  const rules = getNormalizedRule(repoConfig, 'forbiddenBaseBranchPatterns');

  if (rules.value && rules.value.includes(data.pull_request.base.ref)) {
    return {
      message: 'This PR is opened against `' + data.pull_request.base.ref +
        '` branch and will be closed.',
      ...rules,
    };
  }
}
