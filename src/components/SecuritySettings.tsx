
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings: React.FC = () => {
  const [showSecurityTips, setShowSecurityTips] = useState(true);
  const { toast } = useToast();

  const clearAllData = () => {
    try {
      // Clear all localStorage data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('msg_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear all sessionStorage data
      const sessionKeys = Object.keys(sessionStorage);
      sessionKeys.forEach(key => {
        if (key.startsWith('msg_')) {
          sessionStorage.removeItem(key);
        }
      });
      
      toast({
        title: "Dados limpos",
        description: "Todos os dados de rastreamento foram removidos."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao limpar os dados.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-5 h-5 text-green-400" />
          <span className="text-white font-inter font-medium">Configurações de Segurança</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-inter text-sm">Mostrar dicas de segurança</span>
            <Button
              onClick={() => setShowSecurityTips(!showSecurityTips)}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/20 text-white hover:bg-white/5"
            >
              {showSecurityTips ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button
            onClick={clearAllData}
            variant="outline"
            className="w-full bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar todos os dados de rastreamento
          </Button>
        </div>
      </div>

      {showSecurityTips && (
        <Alert className="glass-card border-amber-500/50">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-400">Dicas de Segurança</AlertTitle>
          <AlertDescription className="text-gray-300 space-y-2">
            <div>• Nunca compartilhe links secretos em canais públicos</div>
            <div>• Use canais seguros como apps de mensagem criptografados</div>
            <div>• Links contêm dados sensíveis - trate-os como senhas</div>
            <div>• Verifique se o destinatário recebeu antes de enviar dados críticos</div>
            <div>• Para máxima segurança, use senhas personalizadas</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecuritySettings;
