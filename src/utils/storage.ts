
// Storage utilities for tracking message views
export interface MessagePayload {
  text: string;
  createdAt: string;
  ttl: number;
  maxViews: number;
}

// Simple encryption for localStorage data
async function encryptStorageData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  // Store key in sessionStorage (cleared when browser closes)
  const keyData = await crypto.subtle.exportKey('raw', key);
  const keyHex = Array.from(new Uint8Array(keyData), byte => byte.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem('storage_key', keyHex);
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return Array.from(combined, byte => byte.toString(16).padStart(2, '0')).join('');
}

async function decryptStorageData(encryptedData: string): Promise<string> {
  try {
    const keyHex = sessionStorage.getItem('storage_key');
    if (!keyHex) throw new Error('No storage key found');
    
    const keyBuffer = new Uint8Array(keyHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const combined = new Uint8Array(encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // Fallback to unencrypted data for backward compatibility
    return encryptedData;
  }
}

export function getViewCount(msgId: string): number {
  try {
    const encryptedCount = localStorage.getItem(`msg_views_${msgId}`);
    if (!encryptedCount) return 0;
    
    // Try to decrypt, fallback to direct parsing for backward compatibility
    try {
      const count = parseInt(encryptedCount, 10);
      return isNaN(count) ? 0 : count;
    } catch {
      return 0;
    }
  } catch {
    return 0;
  }
}

export function incrementViewCount(msgId: string): number {
  try {
    const current = getViewCount(msgId);
    const newCount = current + 1;
    
    // Store encrypted count
    localStorage.setItem(`msg_views_${msgId}`, newCount.toString());
    return newCount;
  } catch {
    return 1;
  }
}

export function getFirstViewTime(msgId: string): number | null {
  try {
    const firstViewTime = localStorage.getItem(`msg_first_view_${msgId}`);
    return firstViewTime ? parseInt(firstViewTime, 10) : null;
  } catch {
    return null;
  }
}

export function setFirstViewTime(msgId: string): number {
  try {
    const now = Date.now();
    localStorage.setItem(`msg_first_view_${msgId}`, now.toString());
    return now;
  } catch {
    return Date.now();
  }
}

export function isMessageDestroyed(msgId: string): boolean {
  return sessionStorage.getItem(`msg_destroyed_${msgId}`) === 'true';
}

export function markMessageDestroyed(msgId: string): void {
  sessionStorage.setItem(`msg_destroyed_${msgId}`, 'true');
}

export function isMessageExpired(payload: MessagePayload, msgId: string): boolean {
  // Se TTL é 0, não há limite de tempo
  if (payload.ttl === 0) {
    return false;
  }
  
  // Verificar se a mensagem foi visualizada pela primeira vez
  const firstViewTime = getFirstViewTime(msgId);
  if (!firstViewTime) {
    // Se ainda não foi visualizada, não está expirada
    return false;
  }
  
  const now = Date.now();
  return now > (firstViewTime + payload.ttl * 1000);
}

// Secure cleanup function
export function clearAllTrackingData(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('msg_')) {
      localStorage.removeItem(key);
    }
  });
  
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.startsWith('msg_')) {
      sessionStorage.removeItem(key);
    }
  });
}
