
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateKey, encryptMessage } from '@/utils/crypto';
import { MessagePayload } from '@/utils/storage';
import { Copy, Share2, MessageSquare } from 'lucide-react';

const CreateMessage = () => {
  const [message, setMessage] = useState('');
  const [secretLink, setSecretLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSecretLink = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
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
        ttl: 86400, // 24 hours
        maxViews: 1
      };

      const ciphertext = await encryptMessage(JSON.stringify(payload), key);
      const url = `${window.location.origin}${window.location.pathname}#msg=${ciphertext}&key=${key}`;
      
      setSecretLink(url);
      toast({
        title: "Link secreto gerado!",
        description: "Sua mensagem foi criptografada com sucesso."
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secretLink);
      toast({
        title: "Copiado!",
        description: "Link secreto copiado para a área de transferência."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar o link.",
        variant: "destructive"
      });
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Você recebeu uma mensagem secreta: ${secretLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Você recebeu uma mensagem secreta:`);
    const url = encodeURIComponent(secretLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const createNewMessage = () => {
    setMessage('');
    setSecretLink('');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Mensagens Secretas</h1>
          <p className="text-gray-400">Crie mensagens que se autodestroem após serem lidas</p>
        </div>

        {!secretLink ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Digite sua mensagem secreta aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] bg-gray-900 border-gray-700 text-white placeholder-gray-500 resize-none"
            />
            <Button
              onClick={generateSecretLink}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              {isLoading ? 'Gerando...' : 'Gerar Link Secreto'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Seu link secreto:</p>
              <p className="text-xs text-green-400 break-all font-mono">{secretLink}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={shareWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button
                  onClick={shareTwitter}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>

            <Button
              onClick={createNewMessage}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Nova Mensagem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMessage;
