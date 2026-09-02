const knowledge = {
  personal: {
    name: 'Prasad K',
    role: 'Full Stack Developer & AI Application Developer',
    currentCompany: 'Apploom Technologies',
  },
  experience: [
    { company: 'Apploom Technologies', role: 'Full Stack Developer & AI Applications Developer', current: true },
    { company: 'Tech Mind Info Tech', role: 'Java Full Stack Developer Intern', current: false },
  ],
  skills: {
    languages: ['Java', 'JavaScript', 'TypeScript', 'Python'],
    frontend: ['React', 'Next.js', 'Astro', 'Tailwind CSS', 'HTML', 'CSS', 'Bootstrap', 'Framer Motion'],
    backend: ['Node.js', 'Express.js', 'REST API', 'JWT Authentication'],
    database: ['MongoDB', 'Mongoose', 'Firebase'],
    mobile: ['React Native', 'Expo', 'NativeWind'],
    ai: ['Groq AI', 'OpenAI APIs', 'AI Chatbots', 'Prompt Engineering', 'Google APIs'],
    tools: ['Git', 'GitHub', 'Vercel', 'Render', 'Cloudinary'],
  },
  projects: [
    {
      name: 'SMART AI',
      description: 'AI platform with web application and Android APK. Users can chat with AI, generate content, answer questions, and use multiple AI-powered tools.',
      features: ['AI Chat', 'Multiple AI tools', 'Modern UI', 'Android App', 'Web Version'],
      link: 'https://smart-ai-showcase.vercel.app/',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Android', 'Groq AI'],
    },
    {
      name: 'PICKZO',
      description: 'AI-powered e-commerce website where the AI assistant performs real user actions — search, cart, orders, account management, and more.',
      features: [
        'Product Search', 'AI Shopping Assistant', 'Create Account', 'Login / Logout',
        'Profile Management', 'Cart Management', 'Place / Cancel Orders', 'Order History',
        'JWT Authentication', 'REST API',
      ],
      link: 'https://pickzo.vercel.app/',
      technologies: ['React', 'Node.js', 'MongoDB', 'JWT', 'REST API'],
    },
  ],
  otherProjects:
    'Portfolio Website · ERP System · Invoice System · Property Management · Finance Dashboard · React Native Applications · AI Automation',
};

export default knowledge;
