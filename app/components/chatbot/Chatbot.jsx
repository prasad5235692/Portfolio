'use client';
import { useState, useEffect } from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import './chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.lenis?.stop();
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        window.lenis?.start();
      };
    }
  }, [isOpen]);

  return (
    <ChatProvider open={isOpen} onToggle={onToggle}>
      <div className="chatbot-container">
        <ChatButton />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
