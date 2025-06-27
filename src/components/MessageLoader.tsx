
import React from 'react';

const MessageLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 glass-card rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-white">Descriptografando</h2>
          <p className="text-gray-400 font-inter">Decifrando sua mensagem secreta...</p>
        </div>
      </div>
    </div>
  );
};

export default MessageLoader;
