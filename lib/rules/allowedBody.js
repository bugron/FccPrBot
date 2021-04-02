const { getNormalizedRule } = require('../utils');
const templateParser = require('../templateParser');

/**
 * Checks if PR has an assigned milestone otherwise notifies specified users
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function allowedBody(repoConfig, data) {
  const rules = getNormalizedRule(repoConfig, 'allowedBody');
  const prBody = data.body;

  if (rules.value && rules.value.length) {
    const parsedBody = templateParser(prBody);
    return {
      message: [
        'Please, assign a milestone to this PR.',
        `FYI ${rules.value.map(u => `@${u}`).join(', ')}`
      ].join('\n'),
      ...rules,
    }
  }
}
