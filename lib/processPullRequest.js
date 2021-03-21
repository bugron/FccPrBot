const {
  github,
  configRules,
} = require('./utils');
const rules = require('./rules');

/**
 * Accept webhook payload data and pass it through
 * different rules defined for a repo
 *
 * @param {object} data Github webhook payload data
 */
const processPullRequest = async data => {
  const baseRepoFullName = data.pull_request.base.repo.full_name;
  // Load rules configuration for current repository
  const repoConfig = configRules[baseRepoFullName];
  const githubConfig = {
    owner: data.repository.owner.login,
    repo: data.repository.name
  };

  let warnArray = ['@' + data.pull_request.user.login + ' thanks for the PR.'];
  let shouldBeClosed = false;

  console.log([
    'This PR (' + data.pull_request.base.repo.full_name + '#' +
    data.number + ') is ' + data.action,
    'Pushed branch is `' + data.pull_request.head.ref + '`',
    'PR is opened against `' + data.pull_request.base.ref + '` branch',
    'PR has ' + data.pull_request.commits + ' commit(s)'
  ].join('\n'));

  for (const rule of rules) {
    const returnValue = await rule(repoConfig, data);

    if (returnValue === false) break; // stop processing rules and exit
    if (!returnValue) continue; // nothing is returned, so simply continue

    const { message, critical } = returnValue;

    if (message) warnArray.push(message); // same the message to create a comment later
    if (critical) shouldBeClosed = true; // if a rule is critical, remember to close the PR
  }

  if (warnArray.length > 1) {
    warnArray.push(
      'Please review our [**Guidelines for Contributing**]' +
      '(https://github.com/' + baseRepoFullName +
      repoConfig.repoContribPath + '), thank you!'
    );

    await github.issues.createComment({
      ...githubConfig,
      body: warnArray.join('\n'),
      issue_number: data.pull_request.number
    });
  }

  if (shouldBeClosed) {
    await github.pulls.update({
      ...githubConfig,
      state: 'closed',
      pull_number: data.pull_request.number
    });
  }
};

module.exports = processPullRequest;
