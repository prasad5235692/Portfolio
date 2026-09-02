'use client';
import { useEffect, useRef } from 'react';
import { useChat } from './context/ChatContext';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';

const WELCOME_MSG = {
  id: 0,
  role: 'bot',
  content: `Hi 👋

I'm **Prasad's AI Assistant**.

You can ask me anything about

• Prasad
• Skills
• Projects
• Experience
• Education
• Resume
• Technologies
• Contact
• Current Role`,
};

export default function ChatWindow() {
  const { isOpen, messages, isTyping, onToggle } = useChat();
  const bottomRef = useRef(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className={`chatbot-window ${isOpen ? 'visible' : ''}`}>
      <ChatHeader onClose={onToggle} />

      <div
        className="chatbot-messages"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {messages.length === 0 && <ChatMessage message={WELCOME_MSG} />}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {messages.length === 0 && <QuickReplies />}

      <ChatInput />
    </div>
  );
}
