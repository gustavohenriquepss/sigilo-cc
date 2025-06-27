
import React from 'react';
import { Sparkles } from 'lucide-react';

const CreateMessageHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-6">
        <div className="p-4 glass-card rounded-2xl">
          <Sparkles className="w-8 h-8 text-white" />
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
