/* eslint-disable no-unused-vars */
const { getUptime, FormatLongTimestampAsString } = require('cdcrhelpers');
const { gitDescribe } = require('git-describe');
const glc = require('git-last-commit');
let gitLastCommit = {};
let gitInfo = {};
glc.getLastCommit(function (err, commit) {
  if (!err) gitLastCommit = commit;
});
gitDescribe(__dirname, (err, info) => {
  if (!err) gitInfo = info;
});

exports.ServiceClass = class ServiceClass {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    const appGitInfo = this.app.get('gitInfo');
    return {
      uptime: getUptime(),
      lastCommitInfo: {
        commitId: (appGitInfo && appGitInfo.commitId) || gitLastCommit.hash || '',
        branch: (appGitInfo && appGitInfo.branch) || gitLastCommit.branch || '',
        tag: (appGitInfo && appGitInfo.tag) || gitLastCommit.tag || '',
        committedOn: (appGitInfo && appGitInfo.committedOn) || FormatLongTimestampAsString(gitLastCommit.committedOn * 1000) || '',
        subject: (appGitInfo && appGitInfo.subject) || gitLastCommit.sanitizedSubject || '',
        dirty: (appGitInfo && appGitInfo.dirty) || gitInfo.dirty || '',
      }
    };
  }
};