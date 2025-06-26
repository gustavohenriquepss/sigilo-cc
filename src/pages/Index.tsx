
import React, { useState, useEffect } from 'react';
import CreateMessage from '@/components/CreateMessage';
import ReadMessage from '@/components/ReadMessage';

const Index = () => {
  const [mode, setMode] = useState<'create' | 'read'>('create');
  const [msgId, setMsgId] = useState('');
  const [keyId, setKeyId] = useState('');

  useEffect(() => {
    // Parse URL hash to check if we're in read mode
    const parseHash = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const msg = params.get('msg');
      const key = params.get('key');

      if (msg && key) {
        setMsgId(msg);
        setKeyId(key);
        setMode('read');
      } else {
        setMode('create');
      }
    };

    // Parse hash on load
    parseHash();

    // Listen for hash changes
    const handleHashChange = () => {
      parseHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (mode === 'read') {
    return <ReadMessage msgId={msgId} keyId={keyId} />;
  }

  return <CreateMessage />;
};

export default Index;
