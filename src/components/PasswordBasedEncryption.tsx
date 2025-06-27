
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { deriveKeyFromPassword, encryptMessage } from '@/utils/crypto';
import { validateMessage, sanitizeInput } from '@/utils/security';
import { MessagePayload } from '@/utils/storage';
import { Lock, Copy, Eye, EyeOff } from 'lucide-react';

interface PasswordBasedEncryptionProps {
  onLinkGenerated: (link: string) => void;
  ttl: number;
}

const PasswordBasedEncryption: React.FC<PasswordBasedEncryptionProps> = ({ onLinkGenerated, ttl }) => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSecureLink = async () => {
    const sanitizedMessage = sanitizeInput(message);
    const messageValidation = validateMessage(sanitizedMessage);
    
    if (!messageValidation.isValid) {
      toast({
        title: "Erro de validação",
        description: messageValidation.error,
        variant: "destructive"
      });
      return;
    }

    if (!password || password.length < 8) {
      toast({
        title: "Senha muito fraca",
        description: "Use pelo menos 8 caracteres para a senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate a random salt
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), 
        byte => byte.toString(16).padStart(2, '0')).join('');
      
      const key = await deriveKeyFromPassword(password, salt);
      
      const payload: MessagePayload = {
        text: sanitizedMessage,
        createdAt: new Date().toISOString(),
        ttl: ttl,
        maxViews: 1
      };
      
      const ciphertext = await encryptMessage(JSON.stringify(payload), key);
      const url = `${window.location.origin}${window.location.pathname}#msg=${ciphertext}&salt=${salt}&pwd=1`;
      
      onLinkGenerated(url);
      
      toast({
        title: "Link seguro criado",
        description: "Sua mensagem foi criptografada com sua senha personalizada."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar o link seguro.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Lock className="w-5 h-5 text-blue-400" />
          <span className="text-white font-inter font-medium">Criptografia com Senha</span>
        </div>
        
        <Textarea
          placeholder="Digite sua mensagem secreta..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder-gray-500 resize-none font-inter rounded-xl focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/30"
        />
        
        <div className="space-y-2">
          <label className="block text-white font-inter font-medium text-sm">
            Senha personalizada (mínimo 8 caracteres)
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Digite uma senha forte..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder-gray-500 font-inter rounded-xl focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/30 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        <Button
          onClick={generateSecureLink}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-inter font-medium py-3 h-auto rounded-xl"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gerando...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Gerar Link com Senha
            </>
          )}
        </Button>
      </div>
      
      <div className="text-xs text-gray-400 font-inter leading-relaxed">
        ⚠️ <strong>Maior segurança:</strong> O link gerado não contém a senha. 
        Você deve compartilhar a senha separadamente com o destinatário.
      </div>
    </div>
  );
};

export default PasswordBasedEncryption;
