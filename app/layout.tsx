import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MataCerdas',
  description: 'AI Chatbot Kesehatan Mata',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}