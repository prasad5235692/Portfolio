'use client';
import { useChat } from './context/ChatContext';

const SUGGESTIONS = [
  'Who is Prasad?',
  'What are your skills?',
  'Show projects',
  'Current role?',
  'Contact info',
];

export default function QuickReplies() {
  const { sendMessage, isTyping } = useChat();

  if (isTyping) return null;

  return (
    <div className="chatbot-quick-replies">
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          className="chatbot-quick-btn"
          onClick={() => sendMessage(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
