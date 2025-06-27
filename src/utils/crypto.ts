
import { getRandomDelay, secureWipe } from './security';

// Utility functions for encryption/decryption using Web Crypto API
export async function generateKey(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Derive key from password using PBKDF2
export async function deriveKeyFromPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const keyArray = new Uint8Array(derivedBits);
  return Array.from(keyArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function encryptMessage(payload: string, key: string): Promise<string> {
  let keyBuffer: Uint8Array | null = null;
  let cryptoKey: CryptoKey | null = null;
  
  try {
    keyBuffer = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPayload = new TextEncoder().encode(payload);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      cryptoKey,
      encodedPayload
    );
    
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    const result = Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Secure cleanup
    secureWipe(keyBuffer);
    secureWipe(payload);
    
    return result;
  } catch (error) {
    // Secure cleanup on error
    if (keyBuffer) secureWipe(keyBuffer);
    throw new Error('Falha ao criptografar a mensagem');
  }
}

export async function decryptMessage(ciphertext: string, key: string): Promise<string> {
  let keyBuffer: Uint8Array | null = null;
  let cryptoKey: CryptoKey | null = null;
  let result: string | null = null;
  
  try {
    // Add random delay to prevent timing attacks
    await getRandomDelay();
    
    keyBuffer = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const combined = new Uint8Array(ciphertext.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      cryptoKey,
      encrypted
    );
    
    result = new TextDecoder().decode(decrypted);
    
    // Secure cleanup
    secureWipe(keyBuffer);
    secureWipe(key);
    
    return result;
  } catch (error) {
    // Add consistent timing delay even on error to prevent timing attacks
    await getRandomDelay();
    
    // Secure cleanup on error
    if (keyBuffer) secureWipe(keyBuffer);
    if (result) secureWipe(result);
    
    throw new Error('Falha ao descriptografar a mensagem');
  }
}
