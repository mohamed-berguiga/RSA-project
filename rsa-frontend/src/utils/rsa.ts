// RSA Cryptographic Utilities using Web Crypto API

export interface RSAKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyBase64: string;
  privateKeyBase64: string;
}

/**
 * Generates a 2048-bit RSA key pair for encryption/decryption
 */
export async function generateRSAKeyPair(): Promise<RSAKeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );

  // Export keys to Base64 format for display
  const publicKeyBuffer = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKeyBuffer = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);
  const privateKeyBase64 = arrayBufferToBase64(privateKeyBuffer);

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyBase64,
    privateKeyBase64,
  };
}

/**
 * Encrypts a message using the public key
 */
export async function encryptMessage(
  message: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  );

  return arrayBufferToBase64(encryptedBuffer);
}

/**
 * Decrypts a message using the private key
 */
export async function decryptMessage(
  encryptedBase64: string,
  privateKey: CryptoKey
): Promise<string> {
  const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Helper: Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Helper: Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Format key for display (add line breaks)
 */
export function formatKeyForDisplay(key: string, chunkSize: number = 64): string {
  const chunks: string[] = [];
  for (let i = 0; i < key.length; i += chunkSize) {
    chunks.push(key.slice(i, i + chunkSize));
  }
  return chunks.join("\n");
}
