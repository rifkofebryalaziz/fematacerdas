'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Chat, Message } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
const LAST_CHAT_KEY = 'last_active_chat';

// ✅ FIX Bug 4: Pakai in-memory flag, bukan sessionStorage yang bisa hilang saat tab suspend
// Flag ini hidup selama aplikasi berjalan di tab yang sama
let hasInitializedForUser: string | null = null;

function isAbortError(err: unknown): boolean {
  if (err instanceof Error && err.name === 'AbortError') return true;
  const msg = err instanceof Error ? err.message : JSON.stringify(err);
  return msg.includes('AbortError') || msg.includes('Lock broken');
}

export function useChat(isAuthenticated: boolean) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const activeChatRef = useRef<string | null>(null);
  const isFetchingChats = useRef(false);
  const visibilityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    if (activeChat) {
      localStorage.setItem(LAST_CHAT_KEY, activeChat);
    }
  }, [activeChat]);

  const loadMessages = useCallback(async (chatId: string) => {
    setIsLoadingMessages(true);
    setMessages([]);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(
        (data || []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || [],
        }))
      );
    } catch (err: unknown) {
      if (isAbortError(err)) {
        console.warn('loadMessages: AbortError diabaikan');
        return;
      }
      console.error('Error loading messages:', err instanceof Error ? err.message : err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [supabase]);

  const loadChats = useCallback(async (isTabRestore = false) => {
    if (isFetchingChats.current) return;
    isFetchingChats.current = true;
    setIsLoadingChats(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.warn('Auth error saat loadChats:', userError?.message);
        return;
      }

      // ✅ FIX Bug 4: Gunakan module-level variable (in-memory, tidak hilang saat tab suspend)
      // isNewLogin = true hanya pertama kali user ini login di tab ini
      const isNewLogin = hasInitializedForUser !== user.id;
      if (isNewLogin && !isTabRestore) {
        hasInitializedForUser = user.id;
      }

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
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
          // isTabRestore: selalu pertahankan chat yang aktif
          if (isTabRestore) {
            const savedId = localStorage.getItem(LAST_CHAT_KEY);
            const targetId = prev || savedId;
            const exists = mapped.find((c) => c.id === targetId);
            return exists ? targetId : mapped[0].id;
          }

          // Login baru → jangan auto-select, tampilkan welcome screen
          if (isNewLogin) {
            return null;
          }

          // Reload biasa → pertahankan chat sebelumnya
          const savedId = localStorage.getItem(LAST_CHAT_KEY);
          const targetId = prev || savedId;
          const exists = mapped.find((c) => c.id === targetId);
          return exists ? targetId : (prev || null);
        });
      } else {
        // Tidak ada chat → buat otomatis hanya saat bukan login baru
        if (!isNewLogin || isTabRestore) {
          const { data: newChat } = await supabase
            .from('chats')
            .insert({ user_id: user.id, title: 'Chat Baru' })
            .select()
            .single();
          if (newChat) {
            const nc = { id: newChat.id, title: newChat.title, starred: newChat.starred };
            setChats([nc]);
            setActiveChat(newChat.id);
          }
        }
      }
    } catch (err: unknown) {
      if (isAbortError(err)) {
        console.warn('loadChats: AbortError diabaikan');
        return;
      }
      console.error('Error loading chats:', err instanceof Error ? err.message : err);
    } finally {
      setIsLoadingChats(false);
      isFetchingChats.current = false;
    }
  }, [supabase]);

  useEffect(() => {
    if (!isAuthenticated) {
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      setIsLoadingChats(false);
      localStorage.removeItem(LAST_CHAT_KEY);
      // ✅ Reset in-memory flag saat logout agar login berikutnya terdeteksi sebagai baru
      hasInitializedForUser = null;
      return;
    }

    loadChats(false);

    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;

      if (visibilityDebounceRef.current) {
        clearTimeout(visibilityDebounceRef.current);
      }

      visibilityDebounceRef.current = setTimeout(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.warn('Session tidak valid saat visibility change, skip reload.');
          return;
        }

        let currentChatId = activeChatRef.current;
        if (!currentChatId) {
          const savedId = localStorage.getItem(LAST_CHAT_KEY);
          if (savedId) {
            currentChatId = savedId;
            setActiveChat(savedId);
          }
        }

        // isTabRestore = true → pertahankan chat aktif, jangan reset ke welcome screen
        await loadChats(true);
        if (currentChatId) {
          await loadMessages(currentChatId);
        }
      }, 500);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (visibilityDebounceRef.current) {
        clearTimeout(visibilityDebounceRef.current);
      }
    };
  }, [isAuthenticated, loadChats, loadMessages, supabase]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat, loadMessages]);

  const createNewChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('chats')
        .insert({ user_id: user.id, title: 'Chat Baru' })
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
      loadMessages(id);
      return;
    }
    setActiveChat(id);
  };

  const deleteChat = async (id: string) => {
    try {
      const { error } = await supabase.from('chats').delete().eq('id', id);
      if (error) throw error;
      const remaining = chats.filter((c) => c.id !== id);
      setChats(remaining);
      if (activeChat === id) {
        setMessages([]);
        const nextId = remaining[0]?.id || null;
        setActiveChat(nextId);
        if (nextId) {
          localStorage.setItem(LAST_CHAT_KEY, nextId);
        } else {
          localStorage.removeItem(LAST_CHAT_KEY);
        }
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

    const tempUserId = Date.now().toString();
    setMessages((prev) => [...prev, { id: tempUserId, role: 'user', content }]);
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: loadingId, role: 'assistant', content: '', isLoading: true }]);

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
        setMessages((prev) =>
          prev.map((msg) => msg.id === loadingId ? {
            id: savedMsg?.id || loadingId,
            role: 'assistant',
            content: data.answer,
            sources: data.sources || [],
          } : msg)
        );
      }
    } catch {
      if (activeChatRef.current === currentChatId) {
        setMessages((prev) =>
          prev.map((msg) => msg.id === loadingId ? {
            id: loadingId,
            role: 'assistant',
            content: '❌ Maaf, terjadi kesalahan saat menghubungi server.',
          } : msg)
        );
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