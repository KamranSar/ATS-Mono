'use strict';

/** DO NOT MODIFY
 * Crypto library used for encrypting and decrypting objects.
 * Author: Nathan Brizzee
 */

const CRYPTOR_TYPES = {
  AES_CTR: 'AES-CTR',
  AES_CBC: 'AES-CBC',
  AES_GCM: 'AES-GCM',
  AES_CFB: 'AES-CFB',
  AES_KW: 'AES-KW',
  // AES_CMAC: "AES-CMAC",
  // ECDH: "ECDH",
  // DH: "DH",
  // HMAC: "HMAC"
};

const DIGEST_TYPES = {
  SHA_256: 'SHA-256',
  SHA_384: 'SHA-384',
  SHA_512: 'SHA-512',
};

// https://github.com/niklasvh/base64-arraybuffer/blob/master/lib/base64-arraybuffer.js
const base64Chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
const base64Lookup = new Uint8Array(256);
for (let i = 0; i < base64Chars.length; i++) {
  base64Lookup[base64Chars.charCodeAt(i)] = i;
}

// Constants that shouldn't be changed in the class
const KEYLENGTHBITS = 384; //the number of bits (bytes * 8) you want to derive, values: 8, 16, 32, 64, 128, 256, 384, 512, 1024, 2048
const IVLEN = 128; // Number of bits to extract from keyLengthBits. ivlen + keylen must = keyLengthBits
const KEYLEN = 256; // Number of bits extracted from keyLengthBits. ivlen + keylen must = keyLengthBits
const HASH = 'SHA-256'; // can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
const ITERATIONS = 5011; // Try a prime number
const ENCYTYPE = CRYPTOR_TYPES.AES_GCM; // "AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC"

function generateRandomSalt(asBase64 = false) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  if (asBase64) {
    return arrayBufferToBase64(salt);
  } else {
    return salt;
  }
}

// https://github.com/niklasvh/base64-arraybuffer/blob/master/lib/base64-arraybuffer.js
function arrayBufferToBase64(arraybuffer) {
  let bytes = new Uint8Array(arraybuffer),
    i,
    len = bytes.length,
    base64 = '';

  for (i = 0; i < len; i += 3) {
    base64 += base64Chars[bytes[i] >> 2];
    base64 += base64Chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += base64Chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += base64Chars[bytes[i + 2] & 63];
  }

  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }

  return base64;
}

function base64ToArrayBuffer(base64) {
  let bufferLength = base64.length * 0.75,
    len = base64.length,
    i,
    p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4;

  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }

  let arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

  for (i = 0; i < len; i += 4) {
    encoded1 = base64Lookup[base64.charCodeAt(i)];
    encoded2 = base64Lookup[base64.charCodeAt(i + 1)];
    encoded3 = base64Lookup[base64.charCodeAt(i + 2)];
    encoded4 = base64Lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
}

async function _hash_obj(buffer, digest_type) {
  if (window.isSecureContext) {
    buffer = new TextEncoder('utf-8').encode(JSON.stringify(buffer));
    const hash = await window.crypto.subtle.digest(digest_type, buffer);
    return _toHex(hash);
  } else {
    return buffer;
  }
}

async function SHA_256_Hash(plainTextOrObject) {
  return await _hash_obj(plainTextOrObject, DIGEST_TYPES.SHA_256);
}

async function SHA_384_Hash(plainTextOrObject) {
  return await _hash_obj(plainTextOrObject, DIGEST_TYPES.SHA_384);
}

async function SHA_512_Hash(plainTextOrObject) {
  return await _hash_obj(plainTextOrObject, DIGEST_TYPES.SHA_512);
}

/**
 * Source: https://8gwifi.org/docs/window-crypto-digest.jsp
 *
 * @param {} buffer
 */
function _toHex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i);
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16);
    // We use concatenation and slice for padding
    var padding = '00000000';
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }
  // Join all the hex strings into one

  return hexCodes.join('');
}

async function _getDerivation(password, salt) {
  const textEncoder = new window.TextEncoder('utf-8');
  const passwordBuffer = textEncoder.encode(password);
  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const saltBuffer = textEncoder.encode(salt);
  const params = {
    name: 'PBKDF2',
    hash: HASH,
    salt: saltBuffer,
    iterations: ITERATIONS,
  };
  const derivation = await window.crypto.subtle.deriveBits(
    params,
    importedKey,
    KEYLENGTHBITS
  );
  return derivation;
}

async function _getKey(derivation) {
  const derivedKey = derivation.slice(0, KEYLEN / 8);
  const iv = derivation.slice(IVLEN / 8);
  const importedEncryptionKey = await window.crypto.subtle.importKey(
    'raw',
    derivedKey,
    { name: ENCYTYPE },
    false,
    ['encrypt', 'decrypt']
  );
  return {
    key: importedEncryptionKey,
    iv: iv,
  };
}

async function _encrypt(text, keyObject) {
  const textEncoder = new window.TextEncoder('utf-8');
  const textBuffer = textEncoder.encode(text);
  const encryptedText = await window.crypto.subtle.encrypt(
    { name: ENCYTYPE, iv: keyObject.iv },
    keyObject.key,
    textBuffer
  );
  return encryptedText;
}

async function encryptData(
  plainTextOrObject,
  password,
  salt,
  toBase64String = false
) {
  const derivation = await _getDerivation(password, salt);
  const keyObject = await _getKey(derivation);
  const encryptedObject = await _encrypt(
    JSON.stringify(plainTextOrObject),
    keyObject
  );
  if (toBase64String) {
    const retval = arrayBufferToBase64(encryptedObject);
    return retval;
  } else {
    return encryptedObject;
  }
}

async function _decrypt(encryptedText, keyObject) {
  const decryptedText = await window.crypto.subtle.decrypt(
    { name: ENCYTYPE, iv: keyObject.iv },
    keyObject.key,
    encryptedText
  );
  const textDecoder = new window.TextDecoder('utf-8');
  return textDecoder.decode(decryptedText);
}

async function decryptData(
  encryptedObject,
  password,
  salt,
  fromBase64String = false
) {
  const derivation = await _getDerivation(password, salt);
  const keyObject = await _getKey(derivation);
  let obj = null;
  if (fromBase64String) {
    obj = base64ToArrayBuffer(encryptedObject);
  } else {
    obj = encryptedObject;
  }

  const decryptedObject = await _decrypt(obj, keyObject);
  try {
    const retval = JSON.parse(decryptedObject);
    return retval;
  } catch (e) {
    return decryptedObject;
  }
}

class Cryptor {
  // https://medium.com/coinmonks/fun-times-with-webcrypto-part-1-pbkdf2-815b1c978c9d
  // https://medium.com/@fsjohnny/fun-times-with-webcrypto-part-2-encrypting-decrypting-dfb9fadba5bc
  // https://stackoverflow.com/questions/50820331/how-to-set-the-out-length-with-the-web-crypto-api-subtlecrypto-derivekey-for-p
  // https://github.com/pxjohnny/WebCrypto2Example/blob/master/index.js
  // https://github.com/diafygi/webcrypto-examples#pbkdf2---derivekey
  constructor(password = null, salt = null) {
    this._password = password || generateRandomSalt(true);
    this._salt = salt || generateRandomSalt(false);
  }

  get salt() {
    return this._salt;
  }
  set salt(s) {
    this._salt = s;
  }
  get saltAsBase64() {
    return arrayBufferToBase64(this._salt);
  }

  set saltAsBase64(s) {
    this._salt = base64ToArrayBuffer(s);
  }

  get password() {
    return this._password;
  }

  set password(p) {
    this._password = p;
  }
  async decryptTheData(encryptedObject, fromBase64String = false) {
    return await decryptData(
      encryptedObject,
      this._password,
      this._salt,
      fromBase64String
    );
  }

  async encryptTheData(plainTextOrObject, toBase64String = false) {
    return await encryptData(
      plainTextOrObject,
      this._password,
      this._salt,
      toBase64String
    );
  }
}

/*
 * The following "known" token will encrypt the root.control record in IDB. The
 * root.control.token contains the actual password and salt used to encrypt all other data in IDB
 * !!! these values can never change otherwise encrypted data in the field cannot be read !!!
 * TODO: Move this to an API call that returns the knownToken for a authenticated user.
 */
const knownToken = {
  a: 'cAl1f+d3pt/C0rR+ReHa8+==', // DO NOT CHANGE
  b: 'b3St+M081le/aPpS+eV3R+==', // DO NOT CHANGE
};

export {
  Cryptor,
  generateRandomSalt,
  encryptData,
  decryptData,
  SHA_256_Hash,
  SHA_384_Hash,
  SHA_512_Hash,
  knownToken,
};
