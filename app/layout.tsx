import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MataCerdas',
  description: 'AI Chatbot Kesehatan Mata',
};

// ✅ FIX: Hapus ChatProvider dari sini.
// ChatProvider butuh isAuthenticated dari AuthContext, jadi harus ada di DALAM
// komponen yang bisa akses AuthContext — yaitu di page.tsx lewat ChatContext.tsx.
// Kalau ChatProvider di sini (layout), dia tidak bisa baca isAuthenticated dengan benar
// dan akan dobel dengan ChatProvider yang ada di app/chat/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}