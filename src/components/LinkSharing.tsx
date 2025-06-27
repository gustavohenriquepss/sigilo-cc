
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface LinkSharingProps {
  secretLink: string;
  onCreateNew: () => void;
}

const LinkSharing: React.FC<LinkSharingProps> = ({ secretLink, onCreateNew }) => {
  const { toast } = useToast();

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
    const text = encodeURIComponent(`Você recebeu uma mensagem secreta: ${secretLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
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
        <Button 
          onClick={copyToClipboard} 
          className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Link
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={shareWhatsApp} 
            variant="outline" 
            className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
          >
            <FaWhatsapp className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          
          <Button 
            onClick={shareTwitter} 
            variant="outline" 
            className="bg-transparent border-white/20 text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
          >
            <FaXTwitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
        </div>
      </div>

      <Button 
        onClick={onCreateNew} 
        variant="ghost" 
        className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
      >
        Criar Nova Mensagem
      </Button>
    </div>
  );
};

export default LinkSharing;
