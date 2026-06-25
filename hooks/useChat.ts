'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Chat, Message } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
const LAST_CHAT_KEY = 'last_active_chat';

// In-memory flag — tidak hilang saat tab suspend (berbeda dengan sessionStorage)
let hasInitializedForUser: string | null = null;

function isAbortError(err: unknown): boolean {
  if (err instanceof Error && err.name === 'AbortError') return true;
  const msg = err instanceof Error ? err.message : JSON.stringify(err);
  return msg.includes('AbortError') || msg.includes('Lock broken') || msg.includes('steal');
}

// ✅ PERUBAHAN UTAMA: terima userId dari luar, tidak pernah panggil getUser() sendiri
// Ini menghilangkan lock conflict dengan useAuth yang juga pakai Supabase auth
export function useChat(isAuthenticated: boolean, userId: string | null) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Cache pesan per chatId — hindari fetch ulang yang tidak perlu
  const messagesCacheRef = useRef<Record<string, Message[]>>({});
  const activeChatRef = useRef<string | null>(null);
  const isFetchingChats = useRef(false);
  const isFetchingMessages = useRef(false);
  const visibilityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    if (activeChat) localStorage.setItem(LAST_CHAT_KEY, activeChat);
  }, [activeChat]);

  const loadMessages = useCallback(async (chatId: string, forceRefresh = false) => {
    // ✅ Gunakan cache jika ada dan tidak dipaksa refresh
    if (!forceRefresh && messagesCacheRef.current[chatId]) {
      setMessages(messagesCacheRef.current[chatId]);
      return;
    }

    // ✅ Guard concurrent fetch
    if (isFetchingMessages.current) return;
    isFetchingMessages.current = true;

    setIsLoadingMessages(true);
    setMessages([]);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mapped = (data || []).map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.sources || [],
      }));

      // Simpan ke cache
      messagesCacheRef.current[chatId] = mapped;
      setMessages(mapped);
    } catch (err: unknown) {
      if (isAbortError(err)) { console.warn('loadMessages: AbortError diabaikan'); return; }
      console.error('Error loading messages:', err instanceof Error ? err.message : err);
    } finally {
      setIsLoadingMessages(false);
      isFetchingMessages.current = false;
    }
  }, [supabase]);

  const loadChats = useCallback(async (isTabRestore = false) => {
    // ✅ Tidak perlu auth check — userId sudah divalidasi oleh useAuth
    if (!userId) return;
    if (isFetchingChats.current) return;
    isFetchingChats.current = true;
    setIsLoadingChats(true);

    try {
      const isNewLogin = hasInitializedForUser !== userId;
      if (isNewLogin && !isTabRestore) {
        hasInitializedForUser = userId;
        // Reset cache saat login baru
        messagesCacheRef.current = {};
      }

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const mapped: Chat[] = (data || []).map((c) => ({
        id: c.id,
        title: c.title,
        starred: c.starred,
      }));

      setChats(mapped);

      if (mapped.length > 0) {
        setActiveChat((prev) => {
          if (isTabRestore) {
            const savedId = localStorage.getItem(LAST_CHAT_KEY);
            const targetId = prev || savedId;
            const exists = mapped.find((c) => c.id === targetId);
            return exists ? targetId : mapped[0].id;
          }
          if (isNewLogin) return null;
          const savedId = localStorage.getItem(LAST_CHAT_KEY);
          const targetId = prev || savedId;
          const exists = mapped.find((c) => c.id === targetId);
          return exists ? targetId : (prev || null);
        });
      } else {
        if (!isNewLogin || isTabRestore) {
          const { data: newChat } = await supabase
            .from('chats')
            .insert({ user_id: userId, title: 'Chat Baru' })
            .select()
            .single();
          if (newChat) {
            setChats([{ id: newChat.id, title: newChat.title, starred: newChat.starred }]);
            setActiveChat(newChat.id);
          }
        }
      }
    } catch (err: unknown) {
      if (isAbortError(err)) { console.warn('loadChats: AbortError diabaikan'); return; }
      console.error('Error loading chats:', err instanceof Error ? err.message : err);
    } finally {
      setIsLoadingChats(false);
      isFetchingChats.current = false;
    }
  }, [supabase, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      setIsLoadingChats(false);
      messagesCacheRef.current = {};
      localStorage.removeItem(LAST_CHAT_KEY);
      hasInitializedForUser = null;
      return;
    }

    loadChats(false);

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (visibilityDebounceRef.current) clearTimeout(visibilityDebounceRef.current);

      visibilityDebounceRef.current = setTimeout(async () => {
        // ✅ Tidak perlu getUser() — userId sudah ada dari props
        if (!userId) return;

        let currentChatId = activeChatRef.current;
        if (!currentChatId) {
          const savedId = localStorage.getItem(LAST_CHAT_KEY);
          if (savedId) { currentChatId = savedId; setActiveChat(savedId); }
        }

        await loadChats(true);

        if (currentChatId) {
          // forceRefresh=true saat visibility change agar data terbaru
          await loadMessages(currentChatId, true);
        }
      }, 500);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (visibilityDebounceRef.current) clearTimeout(visibilityDebounceRef.current);
    };
  }, [isAuthenticated, userId, loadChats, loadMessages]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat, loadMessages]);

  const createNewChat = async () => {
    if (!userId) return; // ✅ pakai userId dari parameter
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({ user_id: userId, title: 'Chat Baru' })
        .select()
        .single();
      if (error) throw error;
      const newChat: Chat = { id: data.id, title: data.title, starred: data.starred };
      setMessages([]);
      setChats((prev) => [newChat, ...prev]);
      setActiveChat(data.id);
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  const selectChat = (id: string) => {
    if (id === activeChat) {
      // Force refresh saat klik chat yang sama
      loadMessages(id, true);
      return;
    }
    setActiveChat(id);
  };

  const deleteChat = async (id: string) => {
    try {
      const { error } = await supabase.from('chats').delete().eq('id', id);
      if (error) throw error;
      // Hapus dari cache
      delete messagesCacheRef.current[id];
      const remaining = chats.filter((c) => c.id !== id);
      setChats(remaining);
      if (activeChat === id) {
        setMessages([]);
        const nextId = remaining[0]?.id || null;
        setActiveChat(nextId);
        if (nextId) localStorage.setItem(LAST_CHAT_KEY, nextId);
        else localStorage.removeItem(LAST_CHAT_KEY);
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const toggleStarChat = async (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    const newStarred = !chat.starred;
    setChats((prev) => prev.map((c) => c.id === id ? { ...c, starred: newStarred } : c));
    try {
      const { error } = await supabase.from('chats').update({ starred: newStarred }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      setChats((prev) => prev.map((c) => c.id === id ? { ...c, starred: chat.starred } : c));
      console.error('Error toggling star:', err);
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeChat) return;
    const currentChatId = activeChat;

    const tempId = Date.now().toString();
    const loadingId = (Date.now() + 1).toString();

    const userMsg: Message = { id: tempId, role: 'user', content };
    const loadingMsg: Message = { id: loadingId, role: 'assistant', content: '', isLoading: true };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);

    const isFirstMessage = messages.filter((m) => m.role === 'user').length === 0;
    if (isFirstMessage) {
      const newTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      setChats((prev) => prev.map((c) => c.id === currentChatId ? { ...c, title: newTitle } : c));
      await supabase.from('chats').update({ title: newTitle, updated_at: new Date().toISOString() }).eq('id', currentChatId);
    } else {
      await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', currentChatId);
    }

    await supabase.from('messages').insert({ chat_id: currentChatId, role: 'user', content, sources: [] });

    try {
      const response = await fetch(`${BACKEND_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content, chat_id: currentChatId }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      const { data: savedMsg } = await supabase
        .from('messages')
        .insert({ chat_id: currentChatId, role: 'assistant', content: data.answer, sources: data.sources || [] })
        .select()
        .single();

      if (activeChatRef.current === currentChatId) {
        const assistantMsg: Message = {
          id: savedMsg?.id || loadingId,
          role: 'assistant',
          content: data.answer,
          sources: data.sources || [],
        };
        setMessages((prev) => prev.map((msg) => msg.id === loadingId ? assistantMsg : msg));
        // Update cache
        messagesCacheRef.current[currentChatId] = [
          ...(messagesCacheRef.current[currentChatId] || []).filter(m => m.id !== loadingId),
          { id: tempId, role: 'user', content },
          assistantMsg,
        ];
      }
    } catch {
      if (activeChatRef.current === currentChatId) {
        setMessages((prev) => prev.map((msg) => msg.id === loadingId ? {
          id: loadingId,
          role: 'assistant',
          content: '❌ Maaf, terjadi kesalahan saat menghubungi server.',
        } : msg));
      }
    }
  };

  const getCurrentChatTitle = () =>
    chats.find((c) => c.id === activeChat)?.title || 'Chat Baru';

  return {
    chats, activeChat, messages, isLoadingChats, isLoadingMessages,
    createNewChat, selectChat, deleteChat, toggleStarChat, sendMessage, getCurrentChatTitle,
  };
}