const crypto = require('crypto');

// AES-256-GCM encryption helpers for sensitive fields
// Key must be 32 bytes. Provide as base64 via CC_ENC_KEY or hex via CC_ENC_KEY_HEX.
function getKey() {
  const b64 = process.env.CC_ENC_KEY;
  const hex = process.env.CC_ENC_KEY_HEX;
  let key;
  if (b64) {
    key = Buffer.from(b64, 'base64');
  } else if (hex) {
    key = Buffer.from(hex, 'hex');
  } else {
    throw new Error('CC_ENC_KEY or CC_ENC_KEY_HEX not configured');
  }
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes for AES-256-GCM');
  }
  return key;
}

function encrypt(text) {
  if (typeof text !== 'string') text = String(text ?? '');
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Store as base64: iv.tag.ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

function decrypt(payloadB64) {
  const buf = Buffer.from(String(payloadB64 || ''), 'base64');
  if (buf.length < 12 + 16) throw new Error('Invalid encrypted payload');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const key = getKey();
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

module.exports = { encrypt, decrypt };