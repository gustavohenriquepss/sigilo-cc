
import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface ScreenshotProtectionProps {
  children: React.ReactNode;
  messageId?: string;
}

const ScreenshotProtection: React.FC<ScreenshotProtectionProps> = ({ children, messageId }) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let devToolsOpen = false;
    const threshold = 160;

    // Detectar abertura do DevTools
    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
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
      const forbiddenKeys = [
        'PrintScreen',
        'F12',
        'F11', // Fullscreen também pode ser usado para screenshots
      ];

      // Print Screen
      if (forbiddenKeys.includes(event.key)) {
        event.preventDefault();
        handleSecurityViolation('Tentativa de screenshot detectada');
        return;
      }

      // Ctrl+Shift+I (DevTools)
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
        event.preventDefault();
        handleSecurityViolation('Tentativa de abrir DevTools detectada');
        return;
      }

      // Ctrl+U (View Source)
      if (event.ctrlKey && event.code === 'KeyU') {
        event.preventDefault();
        handleSecurityViolation('Tentativa de visualizar código fonte');
        return;
      }

      // F12 (DevTools)
      if (event.key === 'F12') {
        event.preventDefault();
        handleSecurityViolation('Tentativa de abrir DevTools detectada');
        return;
      }

      // Cmd+Shift+3/4 (macOS screenshots)
      if (event.metaKey && event.shiftKey && (event.code === 'Digit3' || event.code === 'Digit4')) {
        event.preventDefault();
        handleSecurityViolation('Tentativa de screenshot detectada (macOS)');
        return;
      }

      // Cmd+Shift+5 (macOS screen recording)
      if (event.metaKey && event.shiftKey && event.code === 'Digit5') {
        event.preventDefault();
        handleSecurityViolation('Tentativa de gravação de tela detectada');
        return;
      }
    };

    // Detectar perda de foco (possível troca de aplicativo para screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 1000); // Remove blur após 1 segundo
      }
    };

    // Detectar mudança de foco da janela
    const handleWindowBlur = () => {
      setIsBlurred(true);
      setTimeout(() => setIsBlurred(false), 500);
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
    const devToolsInterval = setInterval(detectDevTools, 500);

    // Cleanup
    return () => {
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
    }, 3000);
  };

  return (
    <>
      {/* CSS para proteção contra impressão */}
      <style jsx global>{`
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
        
        /* Watermark invisível */
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
        
        /* Desabilitar seleção */
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div 
        ref={containerRef}
        className={`protected-content no-select relative ${isBlurred ? 'blur-sm' : ''}`}
        data-watermark={`protected-${messageId}-${Date.now()}`}
      >
        {children}
        
        {/* Overlay de aviso de segurança */}
        {showWarning && (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-md flex items-center justify-center z-50 rounded-2xl">
            <div className="bg-red-500 text-white p-4 rounded-xl flex items-center space-x-2 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-medium">Ação de segurança detectada!</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScreenshotProtection;
