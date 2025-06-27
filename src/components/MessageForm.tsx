
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Clock, ArrowRight } from 'lucide-react';

interface MessageFormProps {
  message: string;
  setMessage: (message: string) => void;
  selectedTtl: string;
  setSelectedTtl: (ttl: string) => void;
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
  onGenerateLink: () => void;
  isLoading: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({
  message,
  setMessage,
  selectedTtl,
  setSelectedTtl,
  timerEnabled,
  setTimerEnabled,
  onGenerateLink,
  isLoading
}) => {
  const ttlOptions = [
    { value: '30', label: '30 segundos' },
    { value: '60', label: '1 minuto' },
    { value: '1800', label: '30 minutos' },
    { value: '3600', label: '1 hora' }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <label className="block text-white font-inter font-medium text-sm">
          Sua mensagem secreta
        </label>
        <Textarea 
          placeholder="Digite aqui a mensagem que deseja compartilhar de forma segura..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder-gray-500 resize-none font-inter rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30" 
        />
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-white" />
            <label className="block text-white font-inter font-medium text-sm">
              Tempo de autodestruição
            </label>
          </div>
          <Switch
            checked={timerEnabled}
            onCheckedChange={setTimerEnabled}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20"
          />
        </div>
        
        {timerEnabled && (
          <RadioGroup value={selectedTtl} onValueChange={setSelectedTtl} className="space-y-3 mt-4">
            {ttlOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="border-white/30 text-white data-[state=checked]:bg-white data-[state=checked]:text-black" 
                />
                <label 
                  htmlFor={option.value} 
                  className="text-gray-300 font-inter text-sm cursor-pointer hover:text-white transition-colors"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
      
      <Button 
        onClick={onGenerateLink} 
        disabled={isLoading} 
        className="w-full bg-white text-black hover:bg-gray-100 font-inter font-medium py-3 h-auto rounded-xl elegant-button"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Gerando link...
          </>
        ) : (
          <>
            Gerar Link Secreto
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default MessageForm;
