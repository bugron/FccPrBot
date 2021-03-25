const { getNormalizedRule } = require('../utils');

/**
 * Asserts that the PR is opened from an allowed head branch
 * Note that this check is critical meaning if it is satistfied the PR will be closed
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function forbiddenHeadBranchPatterns(repoConfig, data) {
  const rules = getNormalizedRule(repoConfig, 'forbiddenHeadBranchPatterns');

  if (rules.value && rules.value.includes(data.pull_request.head.ref)) {
    return {
      message: 'You\'ve done your changes in `' + data.pull_request.head.ref +
        '` branch. Always work in a separate, correctly named branch. ' +
        'Closing this PR.',
      ...rules,
    };
  }
}
