
import React, { useRef } from 'react';
import { useScreenshotProtection } from '@/hooks/useScreenshotProtection';
import SecurityWarningOverlay from '@/components/SecurityWarningOverlay';

interface ScreenshotProtectionProps {
  children: React.ReactNode;
  messageId?: string;
}

const ScreenshotProtection: React.FC<ScreenshotProtectionProps> = ({ children, messageId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isBlurred, showWarning } = useScreenshotProtection();

  return (
    <div 
      ref={containerRef}
      className={`protected-content no-select relative ${isBlurred ? 'blur-sm' : ''}`}
      data-watermark={`protected-${messageId}-${Date.now()}`}
    >
      {children}
      <SecurityWarningOverlay isVisible={showWarning} />
    </div>
  );
};

export default ScreenshotProtection;
