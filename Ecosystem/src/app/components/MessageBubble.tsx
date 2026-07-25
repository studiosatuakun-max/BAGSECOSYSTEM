'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const [userEmail, setUserEmail] = React.useState<string>('');
  React.useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.from('users').select('email').eq('id', message.user_id).single();
      if (!error && data) setUserEmail(data.email);
    }
    fetchUser();
  }, [message.user_id]);

  const isOwn = message.user_id === (supabase.auth.session()?.user?.id ?? '');
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs px-3 py-2 rounded-xl ${isOwn ? 'bg-indigo-600 text-white' : 'bg-white/20 text-gray-900'} backdrop-blur-md`}>
        <p className="text-sm break-words">{message.content}</p>
        <span className="text-xs text-gray-300 block text-right mt-1">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
