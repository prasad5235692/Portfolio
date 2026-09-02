'use client';
import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import knowledge from '../data/knowledge';

const ChatContext = createContext(null);

const INTENTS = [
  {
    id: 'greeting',
    patterns: ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'],
    response: () =>
      `Hi there! 👋 I'm Prasad's AI assistant. Feel free to ask me anything about his work, skills, projects, or experience. How can I help you?`,
  },
  {
    id: 'whois',
    patterns: ['who are you', 'tell me about yourself', 'introduce yourself', 'who is prasad', 'about prasad', 'about you'],
    response: () =>
      `I'm **Prasad K** — a **Full Stack Developer & AI Application Developer** currently working at **Apploom Technologies**.

I build modern web applications, AI-powered platforms, and mobile apps with clean architecture and great user experiences.

Want to know about my **skills**, **projects**, or **experience**? Just ask!`,
  },
  {
    id: 'role',
    patterns: ['current role', 'what do you do', 'where do you work', 'your job', 'your position', 'current position'],
    response: () =>
      `I'm currently working as a **Full Stack Developer & AI Applications Developer** at **Apploom Technologies**.

Previously, I was a **Java Full Stack Developer Intern** at **Tech Mind Info Tech**.`,
  },
  {
    id: 'experience',
    patterns: ['experience', 'previous company', 'background', 'work history', 'career', 'previous role', 'intern'],
    response: () =>
      `**Current:** Full Stack Developer & AI Applications Developer @ **Apploom Technologies**

**Previous:** Java Full Stack Developer Intern @ **Tech Mind Info Tech**

I work across the full stack — from React frontends to Node.js backends, and I specialise in AI-powered application development.`,
  },
  {
    id: 'skills',
    patterns: ['skill', 'technolog', 'tech stack', 'what do you know', 'what can you do', 'tool', 'proficien'],
    response: () =>
      `Here's my tech stack 🛠️

**Frontend** — ${knowledge.skills.frontend.join(' · ')}

**Backend** — ${knowledge.skills.backend.join(' · ')}

**Database** — ${knowledge.skills.database.join(' · ')}

**Languages** — ${knowledge.skills.languages.join(' · ')}

**Mobile** — ${knowledge.skills.mobile.join(' · ')}

**AI / ML** — ${knowledge.skills.ai.join(' · ')}

**Tools & DevOps** — ${knowledge.skills.tools.join(' · ')}

Want details on any specific area? Just ask!`,
  },
  {
    id: 'frontend',
    patterns: ['frontend skill', 'front-end skill', 'front end', 'ui skill', 'react', 'next.js', 'tailwind'],
    response: () =>
      `**Frontend Skills** 🎨

${knowledge.skills.frontend.map((s) => `- ${s}`).join('\n')}

I build responsive, animated UIs with React, Next.js, Tailwind CSS, and Framer Motion.`,
  },
  {
    id: 'backend',
    patterns: ['backend skill', 'back-end skill', 'back end', 'server', 'api', 'node.js', 'express'],
    response: () =>
      `**Backend Skills** ⚙️

${knowledge.skills.backend.map((s) => `- ${s}`).join('\n')}

I build RESTful APIs with Node.js, Express, and secure JWT authentication.`,
  },
  {
    id: 'database',
    patterns: ['database', 'db', 'mongo', 'mongodb', 'data', 'storage', 'firebase'],
    response: () =>
      `**Database Skills** 💾

${knowledge.skills.database.map((s) => `- ${s}`).join('\n')}

I work with MongoDB (Mongoose), Firebase, and data modeling for scalable apps.`,
  },
  {
    id: 'ai',
    patterns: ['ai skill', 'machine learning', 'artificial intelligence', 'llm', 'openai', 'groq', 'prompt'],
    response: () =>
      `**AI Skills** 🤖

${knowledge.skills.ai.map((s) => `- ${s}`).join('\n')}

I build AI-powered applications integrating Groq AI, OpenAI APIs, and custom chatbot solutions with prompt engineering.`,
  },
  {
    id: 'projects',
    patterns: ['project', 'built', 'build', 'portfolio', 'work showcase', 'your work', 'what have you made'],
    response: () =>
      `Here are my featured projects 🚀

**1. SMART AI** — AI platform with web app + Android APK. Chat, generate content, use AI tools.
→ *Ask me "tell me about SMART AI" for details*

**2. PICKZO** — AI-powered e-commerce with real AI assistant actions.
→ *Ask me "tell me about PICKZO" for details*

**Other projects:** ${knowledge.otherProjects}`,
  },
  {
    id: 'smartai',
    patterns: ['smart ai', 'smart', 'ai platform', 'ai app'],
    response: () => {
      const p = knowledge.projects[0];
      return `## ${p.name}

${p.description}

**Features:**
${p.features.map((f) => `- ${f}`).join('\n')}

**Built with:** ${p.technologies.join(' · ')}

🔗 [Visit SMART AI →](${p.link})`;
    },
  },
  {
    id: 'pickzo',
    patterns: ['pickzo', 'e-commerce', 'ai assistant', 'shopping'],
    response: () => {
      const p = knowledge.projects[1];
      return `## ${p.name}

${p.description}

**Features:**
${p.features.map((f) => `- ${f}`).join('\n')}

**Built with:** ${p.technologies.join(' · ')}

🔗 [Visit PICKZO →](${p.link})`;
    },
  },
  {
    id: 'contact',
    patterns: ['contact', 'hire', 'reach', 'email', 'phone', 'get in touch', 'connect', 'opportunity'],
    response: () =>
      `I'd love to connect! 🤝

You can reach out through the **Contact / Say Hi** section on this portfolio.

For professional inquiries, collaborations, or exciting opportunities — Prasad is always open to a conversation.

👉 *Scroll down to the Contact section or click **Let's Talk**!*`,
  },
  {
    id: 'resume',
    patterns: ['resume', 'cv', 'curriculum'],
    response: () =>
      `You can view or download Prasad's resume from the **Connect** section at the bottom of this portfolio.

Feel free to reach out if you'd like to discuss opportunities!`,
  },
  {
    id: 'location',
    patterns: ['located', 'location', 'based', 'where are you', 'from where'],
    response: () => `Prasad is based in **India**. You can reach out through the Contact section for location-specific details!`,
  },
  {
    id: 'whyhire',
    patterns: ['why should i hire', 'why hire', 'good developer', 'best', 'unique', 'different'],
    response: () =>
      `Great question! Here's why Prasad stands out 🏆

- **Full-Stack + AI** — Bridges traditional web dev with modern AI integration
- **Product-minded** — Cares about UX, performance, and clean architecture
- **Proven delivery** — Built production-grade platforms (SMART AI, PICKZO, and more)
- **Versatile** — Web, mobile, AI, APIs — end-to-end capability
- **Always learning** — Stays current with modern tools and best practices

Ready to collaborate? Reach out through the **Contact** section!`,
  },
  {
    id: 'thanks',
    patterns: ['thank', 'thanks', 'appreciate', 'grateful'],
    response: () => `You're welcome! 😊 Feel free to ask if you have any more questions. I'm here to help!`,
  },
  {
    id: 'help',
    patterns: ['help', 'what can you do', 'capabilities', 'features', 'options'],
    response: () =>
      `I can help you learn about Prasad! Here's what you can ask me 🎯

- 👤 **"Who is Prasad?"** — About him, his role, and background
- 🛠️ **"What are your skills?"** — Tech stack and expertise
- 🚀 **"Show projects"** — SMART AI, PICKZO, and more
- 💼 **"Current role?"** — Work and experience
- 📞 **"Contact info"** — How to reach out
- 📄 **"Resume"** — View or download resume

What would you like to know?`,
  },
  {
    id: 'projectLink',
    patterns: ['smart ai link', 'pickzo link', 'link to smart', 'link to pickzo', 'project link', 'visit smart', 'visit pickzo'],
    response: (query) => {
      const q = query.toLowerCase();
      if (q.includes('smart')) {
        return `🔗 **SMART AI:** ${knowledge.projects[0].link}`;
      }
      if (q.includes('pickzo')) {
        return `🔗 **PICKZO:** ${knowledge.projects[1].link}`;
      }
      return `Here are the project links:\n- **SMART AI:** ${knowledge.projects[0].link}\n- **PICKZO:** ${knowledge.projects[1].link}`;
    },
  },
];

function matchIntent(query) {
  const q = query.toLowerCase().trim();
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    for (const pattern of intent.patterns) {
      if (q.includes(pattern)) {
        const score = pattern.length;
        if (score > bestScore) {
          bestScore = score;
          best = intent;
        }
      }
    }
  }
  return best;
}

function fallbackResponse() {
  const fallbacks = [
    "I'm not sure I understood that. Could you rephrase? You can ask me about Prasad's skills, projects, experience, or contact info.",
    "Hmm, I don't have an answer for that yet. Try asking about skills, projects, or Prasad's background!",
    "I didn't quite catch that. Feel free to ask about Prasad's work, tech stack, or how to get in touch!",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

const initialState = {
  messages: [],
  isOpen: false,
  isTyping: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_LAST_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m, i) => (i === state.messages.length - 1 ? { ...m, content: action.payload } : m)),
      };
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    case 'CLEAR':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

function streamText(el, text, onDone) {
  let idx = 0;
  const speed = text.length < 100 ? 15 : text.length < 300 ? 10 : 6;
  const interval = setInterval(() => {
    idx++;
    el(idx);
    if (idx >= text.length) {
      clearInterval(interval);
      onDone();
    }
  }, speed);
}

export function ChatProvider({ children, open: externalOpen, onToggle: externalToggle }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const msgIdRef = useRef(0);
  const streamRef = useRef(null);

  const isOpen = externalOpen !== undefined ? externalOpen : state.isOpen;
  const onToggle = externalToggle || (() => dispatch({ type: 'TOGGLE_OPEN' }));

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || state.isTyping) return;

      dispatch({ type: 'ADD_MESSAGE', payload: { id: ++msgIdRef.current, role: 'user', content: trimmed } });

      const intent = matchIntent(trimmed);
      const responseText = intent ? intent.response(trimmed) : fallbackResponse();

      const msgId = ++msgIdRef.current;
      dispatch({ type: 'ADD_MESSAGE', payload: { id: msgId, role: 'bot', content: '' } });
      dispatch({ type: 'SET_TYPING', payload: true });

      const delay = 400 + Math.random() * 300;
      setTimeout(() => {
        dispatch({ type: 'SET_TYPING', payload: false });
        let accumulated = '';
        streamRef.current = streamText(
          (val) => {
            accumulated = responseText.slice(0, val);
            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: accumulated });
          },
          responseText,
          () => {
            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: responseText });
            streamRef.current = null;
          },
        );
      }, delay);
    },
    [state.isTyping],
  );

  const clearChat = useCallback(() => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    dispatch({ type: 'CLEAR' });
    dispatch({ type: 'SET_TYPING', payload: false });
  }, []);

  return (
    <ChatContext.Provider value={{ ...state, isOpen, sendMessage, clearChat, onToggle }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
