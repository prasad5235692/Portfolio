import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from './components/SmoothScroll';
import GlobalCursor from './components/GlobalCursor';
import Chatbot from './components/chatbot/Chatbot';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Prasad K — Full STACK DEVELOPER',
  description: 'Portfolio of Prasad K, a selectively skilled product designer.',
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-[#0C0C0C] text-white noise" suppressHydrationWarning>
        <GlobalCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Chatbot />
      </body>
    </html>
  );
}
