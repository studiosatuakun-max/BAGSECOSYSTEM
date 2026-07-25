'use client';

import React, { useState } from 'react';
import ChatPanel from './ChatPanel';

export default function ChatWidget() {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-40 transition-transform duration-300 hover:scale-105"
        aria-label="Open Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" />
        </svg>
      </button>

      {/* Chat Panel */}
      {showChat && <ChatPanel onClose={() => setShowChat(false)} />}
    </>
  );
}
