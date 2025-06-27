
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  detectDevTools, 
  isForbiddenKey, 
  getSecurityViolationType, 
  createProtectionStyles,
  SECURITY_CONFIG 
} from '@/utils/securityDetection';

export const useScreenshotProtection = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Add global styles
    const style = createProtectionStyles();
    document.head.appendChild(style);

    let devToolsOpen = false;

    // Detectar abertura do DevTools
    const detectDevToolsChange = () => {
      if (detectDevTools()) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          handleSecurityViolation('DevTools detectado');
        }
      } else {
        devToolsOpen = false;
      }
    };

    // Detectar teclas de screenshot
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isForbiddenKey(event)) {
        event.preventDefault();
        const violationType = getSecurityViolationType(event);
        handleSecurityViolation(violationType);
      }
    };

    // Detectar perda de foco (possível troca de aplicativo para screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), SECURITY_CONFIG.BLUR_DURATION);
      }
    };

    // Detectar mudança de foco da janela
    const handleWindowBlur = () => {
      setIsBlurred(true);
      setTimeout(() => setIsBlurred(false), SECURITY_CONFIG.FOCUS_BLUR_DURATION);
    };

    const handleWindowFocus = () => {
      setIsBlurred(false);
    };

    // Desabilitar menu de contexto
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      handleSecurityViolation('Menu de contexto desabilitado');
    };

    // Desabilitar seleção de texto
    const handleSelectStart = (event: Event) => {
      event.preventDefault();
    };

    // Desabilitar arrastar
    const handleDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Monitorar DevTools
    const devToolsInterval = setInterval(detectDevToolsChange, SECURITY_CONFIG.DEV_TOOLS_CHECK_INTERVAL);

    // Cleanup
    return () => {
      document.head.removeChild(style);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(devToolsInterval);
    };
  }, []);

  const handleSecurityViolation = (type: string) => {
    console.warn(`🚨 Violação de segurança: ${type}`);
    
    setShowWarning(true);
    setIsBlurred(true);
    
    toast({
      title: "⚠️ Ação de segurança detectada",
      description: "Screenshots e cópias não são permitidos para proteger o conteúdo.",
      variant: "destructive"
    });

    // Remove o aviso após alguns segundos
    setTimeout(() => {
      setShowWarning(false);
      setIsBlurred(false);
    }, SECURITY_CONFIG.WARNING_DURATION);
  };

  return {
    isBlurred,
    showWarning
  };
};
