const {
  github,
  camelCase
} = require('../utils');

/**
 * Asserts PR file names against supplied patterns
 * Note that this check is critical meaning if it is satistfied the PR will be closed
 *
 * @param {object} repoConfig Repository configuration provided by repo-rules.json file
 * @param {object} data Github webhook payload data
 * @returns {object|boolean} false if all other rules need to be skipped or an object with information
 */
module.exports = async function allowedFileNames(repoConfig, data) {
  if (
    repoConfig.rules.critical.allowedFileNames &&
    repoConfig.rules.critical.allowedFileNames.length
  ) {
    const githubConfig = {
      owner: data.repository.owner.login,
      repo: data.repository.name,
      pull_number: data.pull_request.number
    };
    const { data: filesArr } = await github.pulls.listFiles(githubConfig);
    let isValidFileName = true;

    if (filesArr && filesArr.length) {
      filesArr.every((file) => {
        if (file.filename) {
          isValidFileName =
            repoConfig.rules.critical.allowedFileNames.some((val) => {
              const reg = new RegExp(val, 'i'),
                lastElem = file.filename.
                  split('/')[file.filename.split('/').length - 1];
              return (
                file.filename.match(reg) &&
                file.filename.match(reg)[0].length === lastElem.length &&
                camelCase(lastElem, '-')
              );
            });
          return isValidFileName;
        }
        return false;
      });
    }

    if (!isValidFileName) {
      return {
        message: 'Filenames should not contain any special characters or ' +
          'spaces. Use only `-` to separate words. ' +
          'Files should have the `.md` extension. ' +
          'Filenames should follow a Camel-Case format. Closing this PR.',
        critical: true
      }
    }
  }
}
