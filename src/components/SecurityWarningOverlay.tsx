
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SecurityWarningOverlayProps {
  isVisible: boolean;
}

const SecurityWarningOverlay: React.FC<SecurityWarningOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-red-500/20 backdrop-blur-md flex items-center justify-center z-50 rounded-2xl">
      <div className="bg-red-500 text-white p-4 rounded-xl flex items-center space-x-2 animate-pulse">
        <AlertTriangle className="w-6 h-6" />
        <span className="font-medium">Ação de segurança detectada!</span>
      </div>
    </div>
  );
};

export default SecurityWarningOverlay;
