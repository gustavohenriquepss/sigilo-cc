import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
const SupportBanner = () => {
  return <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/0">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <Link to="/support" className="flex items-center justify-center space-x-2 text-white hover:text-gray-200 transition-colors font-inter text-base font-medium group cursor-pointer">
          <Heart className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
          <span className="group-hover:underline">Apoie este projeto</span>
        </Link>
      </div>
    </div>;
};
export default SupportBanner;