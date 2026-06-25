'use client';

import React, { createContext, useContext } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuthContext } from '@/context/AuthContext';

type ChatContextType = ReturnType<typeof useChat>;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId } = useAuthContext();
  // ✅ Kirim userId langsung — useChat tidak perlu panggil getUser() sendiri
  // Ini menghilangkan Supabase auth lock conflict antara useAuth dan useChat
  const chat = useChat(isAuthenticated, userId);
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used inside ChatProvider');
  return context;
}