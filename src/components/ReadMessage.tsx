
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
import { MessageSquare, Bomb, AlertTriangle } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Descriptografando mensagem...</p>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Mensagem Expirada</h2>
          <p className="text-gray-400">Esta mensagem expirou e não pode mais ser lida.</p>
          <Button onClick={createNewMessage} className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'destroyed') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Bomb className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Mensagem Destruída</h2>
          <p className="text-gray-400">Esta mensagem já foi lida e foi destruída permanentemente.</p>
          <Button onClick={createNewMessage} className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Erro</h2>
          <p className="text-gray-400">Não foi possível carregar esta mensagem. Verifique se o link está correto.</p>
          <Button onClick={createNewMessage} className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Criar Nova Mensagem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-orange-500 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Mensagem Secreta</h1>
        </div>

        <div className="relative">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 min-h-[120px] flex items-center justify-center">
            <p className="text-white text-center whitespace-pre-wrap break-words">{message}</p>
          </div>
          
          {/* Speech bubble tail */}
          <div className="absolute bottom-0 left-8 transform translate-y-full">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-gray-700"></div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={destroyMessage}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg"
            disabled={isExploding}
          >
            <Bomb className="w-4 h-4 mr-2" />
            {isExploding ? 'Destruindo...' : 'Destruir Agora'}
          </Button>
          
          <Button
            onClick={createNewMessage}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            Criar Nova Mensagem
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            ⚠️ Esta mensagem será destruída automaticamente após ser lida
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadMessage;
