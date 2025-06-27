import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Flame, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MessageErrorProps {
  type: 'expired' | 'destroyed' | 'error';
  onCreateNew: () => void;
}

const MessageError: React.FC<MessageErrorProps> = ({ type, onCreateNew }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'expired':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
          title: 'Mensagem Expirada',
          description: 'Esta mensagem expirou e não pode mais ser acessada. Mensagens secretas têm prazo limitado por segurança.'
        };
      case 'destroyed':
        return {
          icon: <Flame className="w-8 h-8 text-red-400" />,
          title: 'Mensagem Destruída',
          description: 'Esta mensagem já foi lida e foi permanentemente destruída para manter a privacidade.'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
          title: 'Erro de Acesso',
          description: 'Não foi possível carregar esta mensagem. Verifique se o link está correto e completo.'
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 glass-card rounded-2xl">
            {icon}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-serif font-semibold text-white">{title}</h2>
          <p className="text-gray-400 font-inter leading-relaxed">
            {description}
          </p>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={onCreateNew} 
            className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 px-8 h-auto rounded-xl elegant-button"
          >
            Criar Nova Mensagem
          </Button>
          
          <Link to="/support">
            <Button 
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
            >
              <Heart className="w-4 h-4 mr-2" />
              Apoie esse projeto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessageError;
