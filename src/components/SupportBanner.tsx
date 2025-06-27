
import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('supportBannerDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('supportBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link 
          to="/support" 
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-inter text-sm"
        >
          <Heart className="w-4 h-4 text-red-400" />
          <span>Apoie este projeto independente</span>
        </Link>
        
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SupportBanner;
