const { getNormalizedRule } = require('../utils');

/**
 * Asserts that the PR title does not contain provided keywords
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function forbiddenTitleKeywords(repoConfig, data) {
  const rules = getNormalizedRule(repoConfig, 'forbiddenTitleKeywords');

  if (rules.value && rules.value.length) {
    let invalidTitlePattern = '(?:' + rules.value.join('|') +
      ')\\s+([\\w\\d-.]*\\/?[\\w\\d-.]*)?#\\d+';
    invalidTitlePattern = new RegExp(invalidTitlePattern, 'ig');

    if (invalidTitlePattern && data.pull_request.title.match(invalidTitlePattern)) {
      return {
        message: 'Do not include issue numbers and following [keywords]' +
          '(https://help.github.com/articles/closing-issues-via-commit-' +
          'messages/#keywords-for-closing-issues) in pull request\'s title.',
        ...rules,
      }
    }
  }
}
