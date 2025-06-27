
export const SECURITY_CONFIG = {
  DEV_TOOLS_THRESHOLD: 160,
  BLUR_DURATION: 1000,
  WARNING_DURATION: 3000,
  FOCUS_BLUR_DURATION: 500,
  DEV_TOOLS_CHECK_INTERVAL: 500,
};

export const detectDevTools = () => {
  return (
    window.outerHeight - window.innerHeight > SECURITY_CONFIG.DEV_TOOLS_THRESHOLD || 
    window.outerWidth - window.innerWidth > SECURITY_CONFIG.DEV_TOOLS_THRESHOLD
  );
};

export const isForbiddenKey = (event: KeyboardEvent): boolean => {
  const forbiddenKeys = ['PrintScreen', 'F12', 'F11'];
  
  // Print Screen and F keys
  if (forbiddenKeys.includes(event.key)) {
    return true;
  }

  // Ctrl+Shift+I (DevTools)
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
    return true;
  }

  // Ctrl+U (View Source)
  if (event.ctrlKey && event.code === 'KeyU') {
    return true;
  }

  // Cmd+Shift+3/4 (macOS screenshots)
  if (event.metaKey && event.shiftKey && (event.code === 'Digit3' || event.code === 'Digit4')) {
    return true;
  }

  // Cmd+Shift+5 (macOS screen recording)
  if (event.metaKey && event.shiftKey && event.code === 'Digit5') {
    return true;
  }

  return false;
};

export const getSecurityViolationType = (event: KeyboardEvent): string => {
  if (event.key === 'PrintScreen') {
    return 'Tentativa de screenshot detectada';
  }
  
  if (event.key === 'F12') {
    return 'Tentativa de abrir DevTools detectada';
  }
  
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
    return 'Tentativa de abrir DevTools detectada';
  }
  
  if (event.ctrlKey && event.code === 'KeyU') {
    return 'Tentativa de visualizar código fonte';
  }
  
  if (event.metaKey && event.shiftKey && (event.code === 'Digit3' || event.code === 'Digit4')) {
    return 'Tentativa de screenshot detectada (macOS)';
  }
  
  if (event.metaKey && event.shiftKey && event.code === 'Digit5') {
    return 'Tentativa de gravação de tela detectada';
  }
  
  return 'Ação de segurança detectada';
};

export const createProtectionStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      * {
        visibility: hidden !important;
      }
      body::after {
        content: "🔒 Conteúdo protegido - Impressão não permitida";
        visibility: visible !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
        color: #000;
      }
    }
    
    .protected-content::before {
      content: attr(data-watermark);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.01;
      font-size: 1px;
      z-index: -1;
    }
    
    .no-select {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
    }
  `;
  return style;
};
