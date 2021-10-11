/* eslint-disable no-unused-vars */
const { getUptime, FormatLongTimestampAsString } = require('cdcrhelpers');
const { gitDescribe } = require('git-describe');
const glc = require('git-last-commit');
const appCfg = require('../../../package.json');

exports.ServiceClass = class ServiceClass {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    // If gitInfo.js file does not exist, then you are running in localhost, which
    // means that Git is installed and can be used to retrieve commit info.
    let appGitInfo = this.app.get('gitInfo');
    if (!appGitInfo) {
      appGitInfo = {};
      let gitLastCommit = {};
      let gitInfo = {};
      const promiseArray = [];
      promiseArray.push(glc.getLastCommit(function (err, commit) {
        if (!err) {
          gitLastCommit = commit;
          appGitInfo.commitId = (gitLastCommit && gitLastCommit.hash) || '';
          appGitInfo.branch = (gitLastCommit && gitLastCommit.branch) || '';
          appGitInfo.tag = (gitLastCommit && gitLastCommit.tag) || '';
          appGitInfo.committedOn = (gitLastCommit && FormatLongTimestampAsString(gitLastCommit.committedOn * 1000)) || '';
          appGitInfo.subject = (gitLastCommit && gitLastCommit.sanitizedSubject) || '';
        }
      }));
      promiseArray.push(gitDescribe(__dirname, (err, info) => {
        if (!err) {
          gitInfo = info;
          appGitInfo.dirty = (gitInfo && gitInfo.dirty) || '';
        }
      }));
      // Wait for promises to finish
      const result = await Promise.all(promiseArray);
    }

    return {
      serverInfo: {
        name: appCfg.name,
        version: appCfg.version
      },
      lastCommitInfo: {
        commitId: appGitInfo.commitId || '',
        branch: appGitInfo.branch || '',
        tag: appGitInfo.tag || '',
        committedOn: appGitInfo.committedOn || '',
        subject: appGitInfo.subject || '',
        dirty: appGitInfo.dirty || '',
      },
      uptime: getUptime()
    };
  }
};