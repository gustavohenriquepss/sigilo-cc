
import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const SupportBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/0">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-white font-inter text-base font-medium">
            <Heart className="w-5 h-5 text-red-400" />
            <span>Apoie este projeto</span>
          </div>
          <Link to="/support">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              Apoiar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportBanner;
