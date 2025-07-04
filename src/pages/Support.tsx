
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Copy, ArrowLeft, User } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Support = () => {
  const { toast } = useToast();
  const pixKey = 'gustavohenriquepss@gmail.com';
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (imageName: string) => {
    console.log(`Failed to load image: ${imageName}`);
    setImageErrors(prev => ({ ...prev, [imageName]: true }));
  };

  const copyAppLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link copiado!",
        description: "Link do app copiado para a área de transferência."
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
    const text = encodeURIComponent(`Esse app permite enviar mensagens que desaparecem depois de lidas: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      toast({
        title: "Chave Pix copiada!",
        description: "Chave Pix copiada para a área de transferência."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar a chave Pix.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        {/* Back button */}
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 glass-card rounded-2xl">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl font-serif text-white text-glow">
            Apoie esse projeto
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <p className="text-gray-300 font-inter text-lg leading-relaxed">
              O Sigilo é um experimento independente sobre mensagens temporárias, anonimato e novas formas de comunicação digital.
            </p>
            
            <p className="text-gray-300 font-inter text-lg leading-relaxed">
              Foi criado em algumas horinhas por mim, <a href="https://linkedin.com/in/gustavohpss" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-gray-200 transition-colors">
                Gustavo Henrique
              </a>, designer de produto e criativo full-stack, com a ideia de transformar uma brincadeira em algo que possa escalar, gerar impacto e talvez até virar negócio. (ou não kkkkk)
            </p>

            {/* Photo with fallback */}
            <div className="flex justify-center my-6">
              {imageErrors['profile'] ? (
                <div className="w-48 h-48 bg-gray-800 rounded-xl border border-white/10 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              ) : (
                <img 
                  src="/lovable-uploads/0ebe366d-86a0-448f-b6f4-c391d29268a9.png" 
                  alt="Gustavo Henrique" 
                  className="w-48 h-48 object-cover rounded-xl border border-white/10"
                  onError={() => handleImageError('profile')}
                  onLoad={() => console.log('Profile image loaded successfully')}
                />
              )}
            </div>

            <p className="text-gray-400 font-inter text-sm leading-relaxed">
              Não tem investidor, nem empresa por trás. 
              Só um pouquinho de tempo livre, música, café e 5 créditos por dia no Lovable.
            </p>

            <p className="text-gray-400 font-inter text-sm leading-relaxed">
              Se você curtiu a proposta, pode apoiar com um Pix para ajudar a pagar o domínio e a assinatura do Lovable pra manter o projeto vivo e evoluindo.
            </p>

            <p className="text-gray-400 font-inter text-sm leading-relaxed">
              Divulgar o app também ajuda demais. Cada novo acesso é um sinal de que vale continuar apostando nessa ideia.
            </p>
          </div>

          {/* Pix Section */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-inter font-medium text-lg">
              Apoie com Pix
            </h3>
            
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 space-y-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 font-inter mb-2">Chave Pix (Nubank):</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-green-400 font-mono">{pixKey}</p>
                    <Button 
                      onClick={copyPixKey} 
                      size="sm" 
                      variant="outline" 
                      className="bg-transparent border-white/20 text-white hover:bg-white/5 ml-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* QR Code with fallback */}
              <div className="bg-white p-4 rounded-xl">
                {imageErrors['qrcode'] ? (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 text-sm text-center">QR Code<br />indisponível</p>
                  </div>
                ) : (
                  <img 
                    src="/lovable-uploads/e0518b74-c202-4ad8-a63e-3e82dda3a500.png" 
                    alt="QR Code Pix" 
                    className="w-48 h-48" 
                    onError={() => handleImageError('qrcode')}
                    onLoad={() => console.log('QR Code loaded successfully')}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 h-auto rounded-xl elegant-button">
                Criar nova mensagem
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={shareWhatsApp} 
                variant="outline" 
                className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
              >
                <FaWhatsapp className="w-4 h-4 mr-2" />
                Compartilhar no WhatsApp
              </Button>
              
              <Button 
                onClick={copyAppLink} 
                variant="outline" 
                className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar link do app
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
