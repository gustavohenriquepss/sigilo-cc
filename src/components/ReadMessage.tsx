
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { decryptMessage } from '@/utils/crypto';
import { 
  MessagePayload, 
  getViewCount, 
  incrementViewCount, 
  isMessageDestroyed, 
  markMessageDestroyed, 
  isMessageExpired 
} from '@/utils/storage';
import { MessageSquare, Flame, AlertTriangle, Sparkles } from 'lucide-react';

interface ReadMessageProps {
  msgId: string;
  keyId: string;
}

const ReadMessage: React.FC<ReadMessageProps> = ({ msgId, keyId }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'destroyed' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    loadMessage();
  }, [msgId, keyId]);

  const loadMessage = async () => {
    try {
      // Check if message was already destroyed in this session
      if (isMessageDestroyed(msgId)) {
        setStatus('destroyed');
        return;
      }

      // Decrypt the message
      const decryptedPayload = await decryptMessage(msgId, keyId);
      const payload: MessagePayload = JSON.parse(decryptedPayload);

      // Check if message has expired
      if (isMessageExpired(payload)) {
        setStatus('expired');
        return;
      }

      // Check view count
      const currentViews = getViewCount(msgId);
      if (currentViews >= payload.maxViews) {
        setStatus('destroyed');
        return;
      }

      // Increment view count and show message
      incrementViewCount(msgId);
      setMessage(payload.text);
      setStatus('success');

    } catch (error) {
      console.error('Erro ao carregar mensagem:', error);
      setStatus('error');
    }
  };

  const destroyMessage = () => {
    setIsExploding(true);
    
    // Clear URL hash
    history.replaceState(null, '', window.location.pathname);
    
    // Mark as destroyed
    markMessageDestroyed(msgId);
    
    setTimeout(() => {
      setIsExploding(false);
      setStatus('destroyed');
    }, 2000);
  };

  const createNewMessage = () => {
    history.replaceState(null, '', window.location.pathname);
    window.location.reload();
  };

  if (status === 'loading') {
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
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 glass-card rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-semibold text-white">Mensagem Expirada</h2>
            <p className="text-gray-400 font-inter leading-relaxed">
              Esta mensagem expirou e não pode mais ser acessada. Mensagens secretas têm prazo limitado por segurança.
            </p>
          </div>
          <Button 
            onClick={createNewMessage} 
            className="bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 px-8 h-auto rounded-xl elegant-button"
          >
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'destroyed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 glass-card rounded-2xl">
              <Flame className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-semibold text-white">Mensagem Destruída</h2>
            <p className="text-gray-400 font-inter leading-relaxed">
              Esta mensagem já foi lida e foi permanentemente destruída para manter a privacidade.
            </p>
          </div>
          <Button 
            onClick={createNewMessage} 
            className="bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 px-8 h-auto rounded-xl elegant-button"
          >
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 glass-card rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-semibold text-white">Erro de Acesso</h2>
            <p className="text-gray-400 font-inter leading-relaxed">
              Não foi possível carregar esta mensagem. Verifique se o link está correto e completo.
            </p>
          </div>
          <Button 
            onClick={createNewMessage} 
            className="bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 px-8 h-auto rounded-xl elegant-button"
          >
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 glass-card rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white text-glow">
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

        <div className="space-y-4">
          <Button
            onClick={destroyMessage}
            disabled={isExploding}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-inter font-medium py-3 h-auto rounded-xl elegant-button"
          >
            <Flame className="w-4 h-4 mr-2" />
            {isExploding ? 'Destruindo...' : 'Destruir Mensagem'}
          </Button>
          
          <Button
            onClick={createNewMessage}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
          >
            Criar Nova Mensagem
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 font-inter">
            ⚠️ Esta mensagem será destruída automaticamente após a leitura
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadMessage;
