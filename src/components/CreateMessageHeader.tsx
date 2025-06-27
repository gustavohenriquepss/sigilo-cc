
import React from 'react';

const CreateMessageHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-6">
        <div className="p-4 glass-card rounded-2xl">
          <svg width="32" height="32" viewBox="0 0 206 206" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M192.975 72.9019H132.939L72.9019 12.8652H132.939L192.975 72.9019Z" fill="white"/>
            <path d="M132.939 192.975V132.939L192.975 72.9019V132.939L132.939 192.975Z" fill="white"/>
            <path d="M12.8652 132.939V72.9019L72.9019 12.8652V72.9019L12.8652 132.939Z" fill="white"/>
            <path d="M12.8652 132.939L72.9019 192.975H132.939L72.9019 132.939H12.8652Z" fill="white"/>
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-serif text-white text-glow">
        Envie mensagens secretas
      </h1>
      <p className="text-gray-400 font-inter text-lg leading-relaxed max-w-md mx-auto">
        Compartilhe segredos que se autodestroem. Sem login, sem rastros.
      </p>
    </div>
  );
};

export default CreateMessageHeader;
