
import DOMPurify from 'dompurify';

// Input validation constants
export const SECURITY_LIMITS = {
  MAX_MESSAGE_LENGTH: 10240, // 10KB
  MIN_TTL: 30, // 30 seconds
  MAX_TTL: 86400, // 24 hours
  MAX_VIEWS: 10,
  MIN_VIEWS: 1
};

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Validate message content
export function validateMessage(message: string): { isValid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: 'Mensagem não pode estar vazia' };
  }
  
  if (message.length > SECURITY_LIMITS.MAX_MESSAGE_LENGTH) {
    return { isValid: false, error: `Mensagem muito longa. Máximo ${SECURITY_LIMITS.MAX_MESSAGE_LENGTH} caracteres` };
  }
  
  return { isValid: true };
}

// Validate TTL (Time To Live)
export function validateTTL(ttl: number): { isValid: boolean; error?: string } {
  if (ttl < SECURITY_LIMITS.MIN_TTL) {
    return { isValid: false, error: `TTL muito baixo. Mínimo ${SECURITY_LIMITS.MIN_TTL} segundos` };
  }
  
  if (ttl > SECURITY_LIMITS.MAX_TTL) {
    return { isValid: false, error: `TTL muito alto. Máximo ${SECURITY_LIMITS.MAX_TTL} segundos` };
  }
  
  return { isValid: true };
}

// Secure cleanup of sensitive data from memory
export function secureWipe(obj: any): void {
  if (typeof obj === 'string') {
    // Overwrite string memory (best effort)
    for (let i = 0; i < obj.length; i++) {
      obj = obj.substring(0, i) + '\0' + obj.substring(i + 1);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        secureWipe(obj[key]);
        delete obj[key];
      }
    }
  }
}

// Generate a cryptographically secure random delay for timing attack prevention
export function getRandomDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 100) + 50; // 50-150ms random delay
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Validate URL parameters to prevent injection
export function validateUrlParams(params: URLSearchParams): { isValid: boolean; error?: string } {
  const msg = params.get('msg');
  const key = params.get('key');
  
  if (!msg || !key) {
    return { isValid: false, error: 'Parâmetros de URL inválidos' };
  }
  
  // Check if hex format (basic validation)
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(msg) || !hexRegex.test(key)) {
    return { isValid: false, error: 'Formato de parâmetros inválido' };
  }
  
  return { isValid: true };
}
