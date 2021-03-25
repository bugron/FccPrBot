const { getNormalizedRule } = require('../utils');

/**
 * Asserts head branch name against supplied patterns
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function allowedHeadBranchPatterns(repoConfig, data) {
  const rules = getNormalizedRule(repoConfig, 'allowedHeadBranchPatterns');

  if (rules.value && rules.value.length) {
    const isPrefix = rules.value.some((val) => {
      return data.pull_request.head.ref.match(new RegExp(val, 'i'));
    });

    if (!isPrefix) {
      return {
        message: 'Your branch name should start with one of `' +
          rules.value.join(', ') +
          '` prefixes. Name your branches correctly next time, please.',
        ...rules,
      };
    }
  }
}
