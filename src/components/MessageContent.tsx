
import React from 'react';
import { Sparkles } from 'lucide-react';
import Timer from '@/components/Timer';
import { MessagePayload } from '@/utils/storage';

interface MessageContentProps {
  message: string;
  messagePayload: MessagePayload;
  msgId: string;
  onExpire: () => void;
}

const MessageContent: React.FC<MessageContentProps> = ({ message, messagePayload, msgId, onExpire }) => {
  // Se TTL é 0, não mostrar timer
  if (messagePayload.ttl === 0) {
    return (
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 glass-card rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-white text-glow">
            Mensagem Secreta
          </h1>
        </div>

        <div className="relative">
          <div className="glass-card rounded-2xl p-8 min-h-[140px] flex items-center justify-center">
            <p className="text-white font-inter text-lg leading-relaxed text-center whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>
          
          {/* Speech bubble tail */}
          <div className="absolute bottom-0 left-8 transform translate-y-full">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white/10"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 font-inter">
            ⚠️ Esta mensagem será destruída automaticamente após a leitura
          </p>
        </div>
      </div>
    );
  }

  // Calcular expiração baseada na criação da mensagem
  const createdAt = new Date(messagePayload.createdAt).getTime();
  const expiresAt = createdAt + (messagePayload.ttl * 1000);

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 glass-card rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-serif text-white text-glow">
          Mensagem Secreta
        </h1>
      </div>

      <Timer 
        expiresAt={expiresAt}
        onExpire={onExpire}
      />

      <div className="relative">
        <div className="glass-card rounded-2xl p-8 min-h-[140px] flex items-center justify-center">
          <p className="text-white font-inter text-lg leading-relaxed text-center whitespace-pre-wrap break-words">
            {message}
          </p>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute bottom-0 left-8 transform translate-y-full">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white/10"></div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 font-inter">
          ⚠️ Esta mensagem será destruída automaticamente após a leitura
        </p>
      </div>
    </div>
  );
};

export default MessageContent;
