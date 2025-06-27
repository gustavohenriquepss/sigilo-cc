
import { getRandomDelay, secureWipe } from './security';

// Utility functions for encryption/decryption using Web Crypto API
export async function generateKey(): Promise<string> {
  console.log('🔑 Gerando chave aleatória...');
  
  if (!window.crypto || !window.crypto.getRandomValues) {
    throw new Error('Web Crypto API não disponível para geração de chaves');
  }
  
  try {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log('✅ Chave gerada com sucesso, tamanho:', key.length);
    return key;
  } catch (error) {
    console.error('❌ Erro na geração da chave:', error);
    throw new Error('Falha ao gerar chave criptográfica');
  }
}

// Derive key from password using PBKDF2
export async function deriveKeyFromPassword(password: string, salt: string): Promise<string> {
  console.log('🔑 Derivando chave da senha...');
  
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API não disponível para derivação de chaves');
  }
  
  try {
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
    const key = Array.from(keyArray, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log('✅ Chave derivada com sucesso');
    return key;
  } catch (error) {
    console.error('❌ Erro na derivação da chave:', error);
    throw new Error('Falha ao derivar chave da senha');
  }
}

export async function encryptMessage(payload: string, key: string): Promise<string> {
  console.log('🔐 Iniciando criptografia...', { payloadLength: payload.length, keyLength: key.length });
  
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API não disponível para criptografia');
  }
  
  // Validar entrada
  if (!payload || payload.length === 0) {
    throw new Error('Payload vazio não pode ser criptografado');
  }
  
  if (!key || key.length !== 64) {
    throw new Error('Chave inválida - deve ter 64 caracteres hexadecimais');
  }
  
  // Validar formato hexadecimal da chave
  if (!/^[0-9a-fA-F]+$/.test(key)) {
    throw new Error('Chave deve estar em formato hexadecimal');
  }
  
  let keyBuffer: Uint8Array | null = null;
  let cryptoKey: CryptoKey | null = null;
  
  try {
    console.log('🔄 Convertendo chave hexadecimal para buffer...');
    keyBuffer = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    console.log('🔄 Importando chave para Web Crypto API...');
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    console.log('🔄 Gerando IV aleatório...');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    console.log('🔄 Codificando payload...');
    const encodedPayload = new TextEncoder().encode(payload);
    
    console.log('🔄 Executando criptografia AES-GCM...');
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      cryptoKey,
      encodedPayload
    );
    
    console.log('🔄 Combinando IV e dados criptografados...');
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    console.log('🔄 Convertendo para formato hexadecimal...');
    const result = Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log('✅ Criptografia concluída com sucesso, tamanho:', result.length);
    
    // Secure cleanup
    secureWipe(keyBuffer);
    secureWipe(payload);
    
    return result;
  } catch (error) {
    console.error('❌ Erro durante criptografia:', error);
    
    // Secure cleanup on error
    if (keyBuffer) secureWipe(keyBuffer);
    
    if (error instanceof Error) {
      throw new Error(`Falha ao criptografar a mensagem: ${error.message}`);
    } else {
      throw new Error('Falha ao criptografar a mensagem');
    }
  }
}

export async function decryptMessage(ciphertext: string, key: string): Promise<string> {
  console.log('🔓 Iniciando descriptografia...', { ciphertextLength: ciphertext.length, keyLength: key.length });
  
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API não disponível para descriptografia');
  }
  
  // Validar entrada
  if (!ciphertext || ciphertext.length === 0) {
    throw new Error('Ciphertext vazio não pode ser descriptografado');
  }
  
  if (!key || key.length !== 64) {
    throw new Error('Chave inválida - deve ter 64 caracteres hexadecimais');
  }
  
  // Validar formato hexadecimal
  if (!/^[0-9a-fA-F]+$/.test(ciphertext)) {
    throw new Error('Ciphertext deve estar em formato hexadecimal');
  }
  
  if (!/^[0-9a-fA-F]+$/.test(key)) {
    throw new Error('Chave deve estar em formato hexadecimal');
  }
  
  let keyBuffer: Uint8Array | null = null;
  let cryptoKey: CryptoKey | null = null;
  let result: string | null = null;
  
  try {
    // Add random delay to prevent timing attacks
    await getRandomDelay();
    
    console.log('🔄 Convertendo chave hexadecimal para buffer...');
    keyBuffer = new Uint8Array(key.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    console.log('🔄 Importando chave para Web Crypto API...');
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    console.log('🔄 Convertendo ciphertext para buffer...');
    const combined = new Uint8Array(ciphertext.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    
    if (combined.length < 12) {
      throw new Error('Ciphertext muito pequeno - dados corrompidos');
    }
    
    console.log('🔄 Separando IV e dados criptografados...');
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    console.log('🔄 Executando descriptografia AES-GCM...');
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      cryptoKey,
      encrypted
    );
    
    console.log('🔄 Decodificando resultado...');
    result = new TextDecoder().decode(decrypted);
    
    console.log('✅ Descriptografia concluída com sucesso');
    
    // Secure cleanup
    secureWipe(keyBuffer);
    secureWipe(key);
    
    return result;
  } catch (error) {
    console.error('❌ Erro durante descriptografia:', error);
    
    // Add consistent timing delay even on error to prevent timing attacks
    await getRandomDelay();
    
    // Secure cleanup on error
    if (keyBuffer) secureWipe(keyBuffer);
    if (result) secureWipe(result);
    
    if (error instanceof Error) {
      throw new Error(`Falha ao descriptografar a mensagem: ${error.message}`);
    } else {
      throw new Error('Falha ao descriptografar a mensagem');
    }
  }
}
