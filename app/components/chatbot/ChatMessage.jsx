'use client';
import { useMemo } from 'react';

function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  let inList = false;
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`}>
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      );
      listItems = [];
      inList = false;
    }
  }

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`}>
            <code>{codeContent}</code>
          </pre>,
        );
        codeContent = '';
        codeLang = '';
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line;
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={`h2-${elements.length}`}>{parseInline(line.slice(3))}</h2>);
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={`h3-${elements.length}`}>{parseInline(line.slice(4))}</h3>);
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('• ')) {
      inList = true;
      listItems.push(parseInline(line.slice(2)));
      continue;
    }

    if (line.trim() === '' && inList) {
      flushList();
      continue;
    }

    if (line.trim() === '') {
      flushList();
      elements.push(<br key={`br-${elements.length}`} />);
      continue;
    }

    flushList();
    elements.push(<p key={`p-${elements.length}`}>{parseInline(line)}</p>);
  }

  flushList();
  if (inCodeBlock) {
    elements.push(
      <pre key={`code-${elements.length}`}>
        <code>{codeContent}</code>
      </pre>,
    );
  }

  return elements;
}

function parseInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Image ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      parts.push(<img key={key++} src={imgMatch[2]} alt={imgMatch[1]} style={{ maxWidth: '100%', borderRadius: 6, margin: '4px 0' }} />);
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // Link [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
          {parseInline(linkMatch[1])}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code `text`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(<code key={key++}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Emoji or regular character (use Array.from for proper Unicode support)
    const chars = Array.from(remaining);
    parts.push(chars[0]);
    remaining = remaining.slice(chars[0].length);
  }

  return parts;
}

export default function ChatMessage({ message }) {
  const content = useMemo(() => renderMarkdown(message.content), [message.content]);

  return (
    <div className={`chatbot-msg ${message.role}`}>
      {content}
    </div>
  );
}
