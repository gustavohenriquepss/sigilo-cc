
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

interface MessageActionsProps {
  onDestroy: () => void;
  onCreateNew: () => void;
  isExploding: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({ onDestroy, onCreateNew, isExploding }) => {
  return (
    <div className="space-y-4">
      <Button
        onClick={onDestroy}
        disabled={isExploding}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-inter font-medium py-3 h-auto rounded-xl elegant-button"
      >
        <Flame className="w-4 h-4 mr-2" />
        {isExploding ? 'Destruindo...' : 'Destruir Mensagem'}
      </Button>
      
      <Button
        onClick={onCreateNew}
        variant="ghost"
        className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
      >
        Criar Nova Mensagem
      </Button>
    </div>
  );
};

export default MessageActions;
