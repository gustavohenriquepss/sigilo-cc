
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  expiresAt: number;
  onExpire: () => void;
}

const Timer: React.FC<TimerProps> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const now = Date.now();
    const remaining = Math.max(0, expiresAt - now);
    
    if (remaining === 0) {
      onExpire();
      return;
    }

    setTimeLeft(remaining);
    if (totalTime === 0) {
      setTotalTime(remaining);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire, totalTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const progressPercentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TimerIcon className="w-4 h-4 text-red-400" />
          <span className="text-xs text-gray-400 font-inter">Autodestruição em:</span>
        </div>
        <span className="text-sm font-mono text-red-400 font-medium">
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2 bg-white/10" 
      />
    </div>
  );
};

export default Timer;
