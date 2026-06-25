'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { User } from '@/types';

function isAbortError(err: unknown): boolean {
  if (err instanceof Error && err.name === 'AbortError') return true;
  const msg = err instanceof Error ? err.message : JSON.stringify(err);
  return msg.includes('AbortError') || msg.includes('Lock broken') || msg.includes('steal');
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // ✅ expose userId
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const isLoadingProfileRef = useRef(false);
  const isAuthenticatedRef = useRef(false);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const router = useRouter();

  const clearSession = useCallback(() => {
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false);
    isAuthenticatedRef.current = false;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) localStorage.removeItem(key);
    });
    localStorage.removeItem('last_active_chat');
  }, []);

  const loadProfile = useCallback(async (authUserId: string) => {
    if (isLoadingProfileRef.current) {
      console.warn('loadProfile: sudah berjalan, skip');
      return;
    }
    isLoadingProfileRef.current = true;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (error) {
        if (isAbortError(error)) { console.warn('loadProfile: AbortError diabaikan'); return; }
        console.error('Load profile error:', error.message);
        return;
      }

      if (profile) {
        setUser({
          name: profile.name || '',
          email: profile.email || '',
          age: profile.age,
          location: profile.location,
          consultationPurpose: profile.consultation_purpose,
          avatar: profile.avatar,
          role: profile.role,
        });
        setUserId(authUserId); // ✅ set userId bersamaan dengan user profile
        setIsAuthenticated(true);
        isAuthenticatedRef.current = true;
      }
    } catch (err: unknown) {
      if (isAbortError(err)) { console.warn('loadProfile: AbortError diabaikan'); return; }
      console.error('loadProfile exception:', err instanceof Error ? err.message : err);
    } finally {
      isLoadingProfileRef.current = false;
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error:', error.message);
          clearSession();
          setIsLoading(false);
          return;
        }
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        if (isAbortError(err)) {
          console.warn('initSession: AbortError diabaikan');
        } else {
          console.warn('Init session failed:', err);
          clearSession();
        }
        setIsLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED' && !session) {
          clearSession(); setIsLoading(false); return;
        }
        if (event === 'SIGNED_OUT') {
          clearSession(); setIsLoading(false); return;
        }
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          clearSession(); setIsLoading(false);
        }
      }
    );

    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (isAbortError(error)) { console.warn('handleVisibility: AbortError diabaikan'); return; }
          clearSession(); return;
        }
        if (!session && isAuthenticatedRef.current) clearSession();
      } catch (err) {
        if (isAbortError(err)) { console.warn('handleVisibility: AbortError diabaikan'); return; }
        clearSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [supabase, loadProfile, clearSession]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) throw new Error(error.message);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { prompt: 'select_account' } },
    });
    if (error) throw new Error(error.message);
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('signOut error:', err);
    } finally {
      clearSession();
      router.push('/');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!userId) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        age: updates.age,
        location: updates.location,
        consultation_purpose: updates.consultationPurpose,
        avatar: updates.avatar,
      })
      .eq('id', userId);
    if (error) throw new Error(error.message);
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return {
    user,
    userId,        // ✅ dipakai oleh ChatContext
    isAuthenticated,
    isLoading,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    logout,
        updateProfile,
  };
}