import {
  github,
  configRules,
  getFiles,
  getContent,
  identifyTranslators
} from './utils';

const _ = require('lodash');

export const translationReview = async (data) => {
  const baseRepoFullName = data.pull_request.base.repo.full_name,
    repoConfig = configRules[baseRepoFullName];
  if (
    !repoConfig.translationTeams ||
    typeof repoConfig.translationTeams !== 'object'
  ) {
    console.log('Can\'t find translation teams list');
    return;
  }

  if (data.action === 'opened' || data.action === 'reopened') {
    let githubConfigFile = {
      user: data.repository.owner.login,
      repo: data.repository.name
    },
    githubConfig = Object.assign({}, githubConfigFile, {
      number: data.pull_request.number
    }),
    currFileName = '', translators = [], msgStart = '',
    Files, headFile, fileHead, baseFile, fileBase;

    try {
      Files = await getFiles(githubConfig);
    } catch (errGetFiles) {
      console.log('Something went wrong while getting PR\'s files.\n' +
        errGetFiles);
      return;
    }
    for (let i = 0; i < Files.length; i++) {
      if (Files[i].filename && Files[i].filename.match(/\.json$/i)) {
        currFileName = Files[i].filename;

        try {
          githubConfigFile.path = currFileName;
          githubConfigFile.ref = data.pull_request.head.ref;
          headFile = await getContent(githubConfigFile);
        } catch (errGetContent) {
          console.log('Something went wrong while getting ' + currFileName +
            ' contents.\n' + errGetContent);
          return;
        }
        fileHead = new Buffer(headFile.content, 'base64').toString('utf8');
        try {
          fileHead = JSON.parse(fileHead);
        } catch (e) {
          console.error(e);
          return;
        }

        try {
          githubConfigFile.path = currFileName;
          githubConfigFile.ref = data.pull_request.base.ref;
          baseFile = await getContent(githubConfigFile);
        } catch (errGetContent) {
          console.log('Something went wrong while getting ' + currFileName +
            ' contents.\n' + errGetContent);
          return;
        }
        fileBase = new Buffer(baseFile.content, 'base64').toString('utf8');
        try {
          fileBase = JSON.parse(fileBase);
        } catch (e) {
          console.error(e);
          return;
        }
        const baseChallenges = fileBase.challenges,
          headChallenges = fileHead.challenges,
          translationTeams = repoConfig.translationTeams;
        // var allMembers = _.uniq(_.flatten(_.values(translationTeams)));

        if (baseChallenges.length === headChallenges.length) {
          const changed = _.differenceWith(
            baseChallenges, headChallenges, _.isEqual
          );
          if (changed.length) {
            let searchObj = {};
            for (let k = 0; k < changed.length; k++) {
              searchObj.title = changed[k].title;
              searchObj.description = changed[k].description;
              if (
                !_.find(baseChallenges, searchObj) ||
                !_.find(headChallenges, searchObj)
              ) {
                translators = translators.concat(
                  identifyTranslators(changed[k], translationTeams)
                );
              }
            }
          }
        } else {
          for (let k = 0; k < baseChallenges.length; k++) {
            translators = translators.concat(
              identifyTranslators(baseChallenges[k], translationTeams)
            );
          }
          msgStart = 'A new challenge is added. ';
          if (baseChallenges.length > headChallenges.length) {
            msgStart = 'A challenge is removed. ';
          }
        }
      }
    }

    if (translators.length) {
      const bodyMsg = msgStart + _.uniq(translators).join(', ') +
        ', please, review this PR for any translation changes.';
      console.log(bodyMsg);
      githubConfig.body = bodyMsg;
      github.issues.createComment(githubConfig);
      delete githubConfig.body;
    }
  }
};
