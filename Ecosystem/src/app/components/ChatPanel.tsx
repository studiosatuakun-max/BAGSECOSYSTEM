'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MessageBubble from './MessageBubble';
import FileCard from './FileCard';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface FileItem {
  id: string;
  file_name: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [channelId, setChannelId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load global channel
  useEffect(() => {
    async function loadChannel() {
      const res = await fetch('/api/chat/channels');
      if (res.ok) {
        const data = await res.json();
        setChannelId(data.id);
      }
    }
    loadChannel();
  }, []);

  // Load initial messages and files when channel ready
  useEffect(() => {
    if (!channelId) return;
    async function loadInitial() {
      const [msgRes, fileRes] = await Promise.all([
        fetch(`/api/chat/messages?channelId=${channelId}`),
        fetch(`/api/chat/files?channelId=${channelId}`),
      ]);
      if (msgRes.ok) setMessages(await msgRes.json());
      if (fileRes.ok) setFiles(await fileRes.json());
    }
    loadInitial();
  }, [channelId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!channelId) return;
    const channel = supabase
      .channel(`public:messages_${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => [newMsg, ...prev]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files', filter: `channel_id=eq.${channelId}` }, (payload) => {
        const newFile = payload.new as FileItem;
        setFiles((prev) => [newFile, ...prev]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  // Auto‑scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !channelId) return;
    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, content: newMessage.trim() }),
    });
    setNewMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !channelId) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('File exceeds 25 MB limit');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('channelId', channelId);
    await fetch('/api/chat/files', { method: 'POST', body: form });
    e.target.value = '';
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[380px] max-w-full bg-white/15 backdrop-blur-xl border-l border-white/30 rounded-l-2xl shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white">All Divisions</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {files.map((f) => (
          <FileCard key={f.id} file={f} />
        ))}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-white placeholder-gray-300 focus:outline-none"
          />
          <label className="cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl p-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
