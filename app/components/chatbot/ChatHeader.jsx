'use client';
export default function ChatHeader({ onClose }) {
  return (
    <div className="chatbot-header">
      <div className="chatbot-header-left">
        <div className="chatbot-header-icon">✦</div>
        <div className="chatbot-header-info">
          <span className="chatbot-header-title">AI Assistant</span>
          <span className="chatbot-header-status">
            <span className="chatbot-status-dot" />
            Online
          </span>
        </div>
      </div>
      <button className="chatbot-header-close" onClick={onClose} aria-label="Close chat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
