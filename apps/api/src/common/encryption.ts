import * as CryptoJS from 'crypto-js';

function getKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY is not set');
  return key;
}

export function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, getKey()).toString();
}

export function decrypt(value: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(value, getKey());
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return value;
  }
}