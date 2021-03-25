/**
 * Asserts head branch name against supplied patterns
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function allowedHeadBranchPatterns(repoConfig, data) {
  if (
    repoConfig.rules.allowedHeadBranchPatterns &&
    repoConfig.rules.allowedHeadBranchPatterns.length
  ) {
    const isPrefix = repoConfig.rules.allowedHeadBranchPatterns.some((val) => {
      return data.pull_request.head.ref.match(new RegExp(val, 'i'));
    });

    if (!isPrefix) {
      return {
        message: 'Your branch name should start with one of `' +
        repoConfig.rules.allowedHeadBranchPatterns.join(', ') +
        '` prefixes. Name your branches correctly next time, please.',
      };
    }
  }
}
