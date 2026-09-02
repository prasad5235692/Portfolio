'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from './context/ChatContext';

export default function ChatInput() {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const { sendMessage, isTyping, isOpen } = useChat();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    sendMessage(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chatbot-input-area">
      <input
        ref={inputRef}
        className="chatbot-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        disabled={isTyping}
      />
      <button
        className="chatbot-send-btn"
        onClick={handleSubmit}
        disabled={!value.trim() || isTyping}
        aria-label="Send"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </button>
    </div>
  );
}
