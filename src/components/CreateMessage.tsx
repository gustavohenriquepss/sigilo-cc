import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { generateKey, encryptMessage } from '@/utils/crypto';
import { MessagePayload } from '@/utils/storage';
import { Copy, Share2, MessageSquare, Sparkles, ArrowRight, Clock } from 'lucide-react';
const CreateMessage = () => {
  const [message, setMessage] = useState('');
  const [selectedTtl, setSelectedTtl] = useState('1800'); // 30 minutes default
  const [secretLink, setSecretLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const ttlOptions = [{
    value: '30',
    label: '30 segundos'
  }, {
    value: '60',
    label: '1 minuto'
  }, {
    value: '1800',
    label: '30 minutos'
  }, {
    value: '3600',
    label: '1 hora'
  }];
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
  return <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 glass-card rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-semibold text-white text-glow">
            Mensagens Secretas
          </h1>
          <p className="text-gray-400 font-inter text-lg leading-relaxed max-w-md mx-auto">Compartilhe segredos que se autodestroem. Sem login, sem rastros.</p>
        </div>

        {!secretLink ? <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <label className="block text-white font-inter font-medium text-sm">
                Sua mensagem secreta
              </label>
              <Textarea placeholder="Digite aqui a mensagem que deseja compartilhar de forma segura..." value={message} onChange={e => setMessage(e.target.value)} className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder-gray-500 resize-none font-inter rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30" />
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-5 h-5 text-white" />
                <label className="block text-white font-inter font-medium text-sm">
                  Tempo até autodestruição
                </label>
              </div>
              <RadioGroup value={selectedTtl} onValueChange={setSelectedTtl} className="space-y-3">
                {ttlOptions.map(option => <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} className="border-white/30 text-white data-[state=checked]:bg-white data-[state=checked]:text-black" />
                    <label htmlFor={option.value} className="text-gray-300 font-inter text-sm cursor-pointer hover:text-white transition-colors">
                      {option.label}
                    </label>
                  </div>)}
              </RadioGroup>
            </div>
            
            <Button onClick={generateSecretLink} disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
              {isLoading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Gerando link...
                </> : <>
                  Gerar Link Secreto
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>}
            </Button>
          </div> : <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span className="text-white font-inter font-medium">Link secreto criado</span>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 font-inter mb-2">Seu link criptografado:</p>
                <p className="text-xs text-green-400 break-all font-mono leading-relaxed">{secretLink}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={copyToClipboard} className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={shareWhatsApp} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
                  <Share2 className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button onClick={shareTwitter} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>

            <Button onClick={createNewMessage} variant="ghost" className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
              Criar Nova Mensagem
            </Button>
          </div>}
      </div>
    </div>;
};
export default CreateMessage;