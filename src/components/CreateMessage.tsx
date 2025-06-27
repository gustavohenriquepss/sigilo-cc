
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateKey, encryptMessage } from '@/utils/crypto';
import { MessagePayload } from '@/utils/storage';
import CreateMessageHeader from './CreateMessageHeader';
import MessageForm from './MessageForm';
import LinkSharing from './LinkSharing';

const CreateMessage = () => {
  const [message, setMessage] = useState('');
  const [selectedTtl, setSelectedTtl] = useState('1800'); // 30 minutes default
  const [secretLink, setSecretLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSecretLink = async () => {
    if (!message.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite uma mensagem antes de gerar o link secreto.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const key = await generateKey();
      const payload: MessagePayload = {
        text: message,
        createdAt: new Date().toISOString(),
        ttl: parseInt(selectedTtl),
        maxViews: 1
      };
      const ciphertext = await encryptMessage(JSON.stringify(payload), key);
      const url = `${window.location.origin}${window.location.pathname}#msg=${ciphertext}&key=${key}`;
      setSecretLink(url);
      
      toast({
        title: "Link criado com sucesso",
        description: "Sua mensagem foi criptografada e está pronta para compartilhar."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar o link secreto.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const createNewMessage = () => {
    setMessage('');
    setSecretLink('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <CreateMessageHeader />

        {!secretLink ? (
          <MessageForm
            message={message}
            setMessage={setMessage}
            selectedTtl={selectedTtl}
            setSelectedTtl={setSelectedTtl}
            onGenerateLink={generateSecretLink}
            isLoading={isLoading}
          />
        ) : (
          <LinkSharing
            secretLink={secretLink}
            onCreateNew={createNewMessage}
          />
        )}
      </div>
    </div>
  );
};

export default CreateMessage;
