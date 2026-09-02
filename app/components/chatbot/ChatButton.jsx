'use client';
import { useRef } from 'react';
import { Bot, X } from 'lucide-react';
import { useChat } from './context/ChatContext';
import { useMagnetic } from '../Magnetic';

export default function ChatButton() {
  const { isOpen, onToggle } = useChat();
  const btnRef = useRef(null);
  useMagnetic(btnRef, { strength: 0.3, radius: 150 });

  return (
    <button
      ref={btnRef}
      className={`chatbot-button ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X size={20} className="chatbot-btn-icon" />
      ) : (
        <Bot size={24} className="chatbot-btn-icon" />
      )}
    </button>
  );
}
