
import React from 'react';

interface ExplosionEffectProps {
  isExploding: boolean;
}

const ExplosionEffect: React.FC<ExplosionEffectProps> = ({ isExploding }) => {
  if (!isExploding) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  );
};

export default ExplosionEffect;
