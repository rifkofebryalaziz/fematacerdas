'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Chat, Message } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export function useChat(isAuthenticated: boolean) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const activeChatRef = useRef<string | null>(null);
  const isFetchingChats = useRef(false);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    activeChatRef.current = activeChat;
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

      if (activeChatRef.current === chatId) {
        setMessages(
          (data || []).map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.sources || [],
          }))
        );
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      if (activeChatRef.current === chatId) {
        setIsLoadingMessages(false);
      }
    }
  }, [supabase]);

  const loadChats = useCallback(async () => {
    if (isFetchingChats.current) return;
    isFetchingChats.current = true;
    setIsLoadingChats(true);
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
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
          const stillExists = mapped.find((c) => c.id === prev);
          return stillExists ? prev : mapped[0].id;
        });
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newChat } = await supabase
            .from('chats')
            .insert({ user_id: user.id, title: 'Chat Baru' })
            .select()
            .single();
          if (newChat) {
            setChats([{ id: newChat.id, title: newChat.title, starred: newChat.starred }]);
            setActiveChat(newChat.id);
          }
        }
      }
    } catch (err) {
      console.error('Error loading chats:', err);
    } finally {
      setIsLoadingChats(false);
      isFetchingChats.current = false;
    }
  }, [supabase]);

  // ✅ Hanya jalan saat isAuthenticated = true
  useEffect(() => {
    if (!isAuthenticated) {
      // Reset semua state saat logout
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      setIsLoadingChats(false);
      return;
    }

    // Load pertama kali setelah login
    loadChats();

    // ✅ Reload saat tab aktif kembali
    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return;
      const currentChatId = activeChatRef.current;
      await Promise.all([
        loadChats(),
        currentChatId ? loadMessages(currentChatId) : Promise.resolve(),
      ]);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthenticated, loadChats, loadMessages]);

  // Load messages saat activeChat berubah
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
    if (id === activeChat) return;
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
        setActiveChat(remaining[0]?.id || null);
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