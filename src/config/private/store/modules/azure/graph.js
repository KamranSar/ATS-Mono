import { myMSALObj, getTokenPopup, getTokenRedirect } from './auth';
import { loginRequest, graphConfig } from './authConfig';

// Helper function to call MS Graph API endpoint
// using authorization bearer token scheme
function callMSGraph(endpoint, accessToken, expectJson) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  if (expectJson) {
    return fetch(endpoint, options)
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => console.log(error));
  } else {
    return fetch(endpoint, options)
      .then((response) => response)
      .catch((error) => console.log(error));
  }
}

async function seeProfile(accountId) {
  if (graphConfig.myInfoEndpoint && accountId) {
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    if (currentAcc) {
      const response = await getTokenPopup(loginRequest, currentAcc).catch(
        (error) => {
          console.log(error);
        }
      );
      try {
        const graphResponse = await callMSGraph(
          graphConfig.myInfoEndpoint,
          response.accessToken,
          true
        );
        return graphResponse;
      } catch (e) {
        console.log(e);
      }
    }
  }
  return null;
}

async function seeProfileRedirect(accountId) {
  if (graphConfig.myInfoEndpoint && accountId) {
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    if (currentAcc) {
      const response = await getTokenRedirect(loginRequest, currentAcc).catch(
        (error) => {
          console.log(error);
        }
      );
      try {
        const graphResponse = await callMSGraph(
          graphConfig.myInfoEndpoint,
          response.accessToken,
          true
        );
        return graphResponse;
      } catch (e) {
        console.log(e);
      }
    }
  }
  return null;
}

async function seeProfilePhoto(accountId) {
  if (graphConfig.profilePhotoEndpoint && accountId) {
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    if (currentAcc) {
      const response = await getTokenPopup(loginRequest, currentAcc).catch(
        (error) => {
          console.log(error);
        }
      );
      try {
        const graphResponse = await callMSGraph(
          graphConfig.profilePhotoEndpoint,
          response.accessToken,
          false
        );
        if (graphResponse.status === 200) {
          if (graphResponse.body instanceof ReadableStream) {
            const reader = graphResponse.body.getReader();

            // Read the image in chunks and then re-assemble them into a base64 image
            const binaryData = [];
            // https://web.dev/fetch-upload-streaming/
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              // console.log('Received', value); // Can be used to keep track of chunk numbers
              binaryData.push(value);
            }
            //https://stackoverflow.com/questions/14071463/how-can-i-merge-typedarrays-in-javascript
            const mergedUint8Array = new Uint8Array(
              binaryData
                .map((typedArray) => [...new Uint8Array(typedArray.buffer)])
                .flat()
            );
            const base64String = window.btoa(
              String.fromCharCode(...mergedUint8Array)
            );
            return base64String;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  return null;
}

async function seeProfilePhotoMeta(accountId) {
  if (graphConfig.profilePhotoMetaEndpoint && accountId) {
    const currentAcc = myMSALObj.getAccountByHomeId(accountId);
    if (currentAcc) {
      const response = await getTokenPopup(loginRequest, currentAcc).catch(
        (error) => {
          console.log(error);
        }
      );
      try {
        const graphResponse = await callMSGraph(
          graphConfig.profilePhotoMetaEndpoint,
          response.accessToken,
          true
        );
        return graphResponse;
      } catch (e) {
        console.log(e);
      }
    }
  }
  return null;
}

export { seeProfile, seeProfileRedirect, seeProfilePhoto, seeProfilePhotoMeta };
