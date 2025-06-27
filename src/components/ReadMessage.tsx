import React, { useState, useEffect } from 'react';
import { decryptMessage } from '@/utils/crypto';
import { 
  MessagePayload, 
  getViewCount, 
  incrementViewCount, 
  isMessageDestroyed, 
  markMessageDestroyed, 
  isMessageExpired 
} from '@/utils/storage';
import MessageLoader from '@/components/MessageLoader';
import MessageError from '@/components/MessageError';
import MessageContent from '@/components/MessageContent';
import MessageActions from '@/components/MessageActions';
import ExplosionEffect from '@/components/ExplosionEffect';

interface ReadMessageProps {
  msgId: string;
  keyId: string;
}

const ReadMessage: React.FC<ReadMessageProps> = ({ msgId, keyId }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'destroyed' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [messagePayload, setMessagePayload] = useState<MessagePayload | null>(null);
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
      setMessagePayload(payload);
      setStatus('success');

    } catch (error) {
      console.error('Erro ao carregar mensagem:', error);
      setStatus('error');
    }
  };

  const handleExpire = () => {
    setStatus('expired');
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
    return <MessageLoader />;
  }

  if (status === 'expired' || status === 'destroyed' || status === 'error') {
    return <MessageError type={status} onCreateNew={createNewMessage} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ExplosionEffect isExploding={isExploding} />
      
      <div className="w-full max-w-lg space-y-6">
        {messagePayload && (
          <MessageContent 
            message={message}
            messagePayload={messagePayload}
            onExpire={handleExpire}
          />
        )}
        
        <MessageActions 
          onDestroy={destroyMessage}
          onCreateNew={createNewMessage}
          isExploding={isExploding}
        />
      </div>
    </div>
  );
};

export default ReadMessage;
