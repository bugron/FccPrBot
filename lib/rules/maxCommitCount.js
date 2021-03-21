const {
  github
} = require('../utils');

/**
 * Makes sure that the PR contains no more than the specifed number of commits
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function maxCommitCount(repoConfig, data) {
  if (repoConfig.rules.maxCommitCount) {
    const maxCommitCount = parseInt(repoConfig.rules.maxCommitCount, 10);

    if (isNaN(maxCommitCount)) {
      throw new Error(`${repoConfig.rules.maxCommitCount} can't be converted into an integer`);
    }

    const githubConfig = {
      owner: data.repository.owner.login,
      repo: data.repository.name,
      pull_number: data.pull_request.number
    };
    const { data: commits } = await github.pulls.listCommits(githubConfig);

    if (commits && commits.length) {
      for (let l = 0; l < commits.length; l++) {
        // show more debug info (commits of the current PR)
        console.log((l + 1) + ': ' + commits[l].commit.message);
      }

      if (commits.length > maxCommitCount) {
        return {
          message: 'You have pushed more than one commit. ' +
            'When you finish editing, [squash](https://forum.freecodecamp.com' +
            '/t/how-to-squash-multiple-commits-into-one-with-git/13231) your ' +
            'commits into one.'
        }
      }
    }
  }
}
