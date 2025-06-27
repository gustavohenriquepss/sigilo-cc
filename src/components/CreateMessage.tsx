
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateKey, encryptMessage } from '@/utils/crypto';
import { validateMessage, validateTTL, sanitizeInput } from '@/utils/security';
import { MessagePayload } from '@/utils/storage';
import CreateMessageHeader from './CreateMessageHeader';
import MessageForm from './MessageForm';
import LinkSharing from './LinkSharing';

const CreateMessage = () => {
  const [message, setMessage] = useState('');
  const [selectedTtl, setSelectedTtl] = useState('30'); // 30 segundos como padrão
  const [secretLink, setSecretLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSecretLink = async () => {
    console.log('🔄 Iniciando geração de link secreto...');
    
    // Verificar se a Web Crypto API está disponível
    if (!window.crypto || !window.crypto.subtle) {
      console.error('❌ Web Crypto API não disponível');
      toast({
        title: "Erro de compatibilidade",
        description: "Seu navegador não suporta criptografia. Use um navegador mais recente.",
        variant: "destructive"
      });
      return;
    }

    // Sanitizar entrada
    const sanitizedMessage = sanitizeInput(message);
    console.log('🧹 Mensagem sanitizada, tamanho:', sanitizedMessage.length);

    // Validar mensagem
    const messageValidation = validateMessage(sanitizedMessage);
    if (!messageValidation.isValid) {
      console.error('❌ Validação da mensagem falhou:', messageValidation.error);
      toast({
        title: "Erro de validação",
        description: messageValidation.error,
        variant: "destructive"
      });
      return;
    }

    const ttlNumber = parseInt(selectedTtl);
    
    // Validar TTL apenas se não for 0 (sem limite)
    if (ttlNumber > 0) {
      const ttlValidation = validateTTL(ttlNumber);
      if (!ttlValidation.isValid) {
        console.error('❌ Validação do TTL falhou:', ttlValidation.error);
        toast({
          title: "Erro de validação",
          description: ttlValidation.error,
          variant: "destructive"
        });
        return;
      }
    }

    console.log('✅ Validações passaram - TTL:', ttlNumber === 0 ? 'sem limite' : `${ttlNumber} segundos`);

    setIsLoading(true);
    try {
      console.log('🔑 Gerando chave criptográfica...');
      const key = await generateKey();
      console.log('✅ Chave gerada, tamanho:', key.length, 'caracteres');

      const payload: MessagePayload = {
        text: sanitizedMessage,
        createdAt: new Date().toISOString(),
        ttl: ttlNumber,
        maxViews: 1
      };
      
      console.log('📦 Payload criado:', {
        textLength: payload.text.length,
        createdAt: payload.createdAt,
        ttl: payload.ttl,
        maxViews: payload.maxViews
      });

      const payloadString = JSON.stringify(payload);
      console.log('📋 Payload serializado, tamanho:', payloadString.length, 'caracteres');

      console.log('🔐 Iniciando criptografia...');
      const ciphertext = await encryptMessage(payloadString, key);
      console.log('✅ Criptografia concluída, tamanho do ciphertext:', ciphertext.length, 'caracteres');

      const url = `${window.location.origin}${window.location.pathname}#msg=${ciphertext}&key=${key}`;
      console.log('🔗 URL gerada, tamanho total:', url.length, 'caracteres');
      
      setSecretLink(url);
      
      toast({
        title: "Link criado com sucesso",
        description: "Sua mensagem foi criptografada e está pronta para compartilhar."
      });

      console.log('🎉 Link secreto gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro durante geração do link:', error);
      
      let errorMessage = "Falha ao gerar o link secreto.";
      if (error instanceof Error) {
        console.error('📝 Detalhes do erro:', error.message);
        console.error('📚 Stack trace:', error.stack);
        
        // Personalizar mensagem baseada no tipo de erro
        if (error.message.includes('encrypt')) {
          errorMessage = "Erro na criptografia da mensagem.";
        } else if (error.message.includes('key')) {
          errorMessage = "Erro na geração da chave criptográfica.";
        } else if (error.message.includes('crypto')) {
          errorMessage = "Erro no sistema de criptografia do navegador.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const createNewMessage = () => {
    console.log('🔄 Criando nova mensagem...');
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
