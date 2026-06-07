import CryptoJS from 'crypto-js';

const SECRET = process.env.ENCRYPTION_SECRET || 'heritage-ai-default-secret-32ch';

export function encryptStateId(stateId: string): string {
  return CryptoJS.AES.encrypt(stateId, SECRET).toString();
}

export function decryptStateId(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
