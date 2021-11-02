import Heartbeat from '@/feathers/services/heartbeat/heartbeat.service.js';
import store from '@/store';
/**
 * getApiVersion
 * Uses the Feathers Service we created for Heartbeat to directly call the find() method on the service.
 */
async function getApiVersion() {
  try {
    const { lastCommitInfo } = await Heartbeat.find();
    const apiBranch = lastCommitInfo.branch;
    const tag = lastCommitInfo.tag;
    const dirty = lastCommitInfo.dirty;
    const commitId = lastCommitInfo.commitId;
    const committedOn = lastCommitInfo.committedOn;
    const commitMessage = lastCommitInfo.subject;
    const listItems = [
      {
        label: 'API Branch',
        message: `${apiBranch}${dirty ? '-dirty' : ''}${
          tag !== '' ? '(tag:' + tag + ')' : ''
        }`,
      },
      {
        label: 'Commit ID',
        message: commitId,
      },
      {
        label: 'Committed On ',
        message: committedOn,
      },
      {
        label: 'Message',
        message: commitMessage,
      },
    ];
    const htmlMessage = `<h4>API Versioning</h4>`;
    let unorderedList = `<ul>`;
    listItems.forEach((item, index) => {
      unorderedList += `<li><b>${item.label}:</b> ${item.message}</li>`;

      if (index === listItems.length - 1) {
        unorderedList += `</ul>`;
      }
    });

    const options = {
      color: 'grey darken-1',
      bottom: true,
      center: true,
      message: htmlMessage + unorderedList,
      timeout: 60000,
    };
    store.dispatch('app/SET_SNACKBAR', options);
  } catch (error) {
    console.error(error);
  }
}

export default getApiVersion;
