const crypto = require('crypto');
const { Octokit } = require('@octokit/rest');
const { config } = require('../package.json');

let configRules = require('../repo-rules.json');

if (typeof configRules !== 'object') {
  try {
    configRules = JSON.parse(configRules);
  } catch (e) {
    console.log('Repository\'s configuration is not an object, exiting.');
    throw e;
  }
}

exports.configRules = configRules;

exports.github = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  host: config.gheHost || 'api.github.com',
  protocol: config.gheProtocol || 'https',
  port: config.ghePort || '443'
});

/**
 * Perform a "constant time" string comparison on given string values
 *
 * @param {string} string1
 * @param {string} string2
 * @returns {boolean} the result of comparison
 */
exports.timingSafeEqual = (string1, string2) =>
  crypto.timingSafeEqual(Buffer.from(string1), Buffer.from(string2));

/**
 * Takes a string and a separator and return that string in camel case
 *
 * @param {string} str a string which needs to be camelcase'd
 * @param {string} separator
 * @returns {string}
 */
exports.camelCase = function camelCase(str, separator) {
  let words = str.toLowerCase().split(separator);
  return words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substr(1);
  }).join(separator) === str;
}

/**
 * Returns a normalized object containing given rule
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {string} ruleName a rule name
 * @returns {object} normalized object containing a rule
 */
exports.getNormalizedRule = function getNormalizedRule(repoConfig, ruleName) {
  if (!repoConfig || !repoConfig.rules || !repoConfig.rules[ruleName]) {
    throw new Error('No rules are provided');
  }

  return repoConfig.rules[ruleName].value
    ? repoConfig.rules[ruleName]
    : { value: repoConfig.rules[ruleName] };
}
