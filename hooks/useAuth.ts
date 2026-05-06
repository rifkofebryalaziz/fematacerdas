'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@/types';

// ✅ Helper: deteksi AbortError/Lock conflict — bukan error fatal
function isAbortError(err: unknown): boolean {
  if (err instanceof Error && err.name === 'AbortError') return true;
  const msg = err instanceof Error ? err.message : JSON.stringify(err);
  return msg.includes('AbortError') || msg.includes('Lock broken');
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  // ✅ Guard agar loadProfile tidak jalan bersamaan (concurrent)
  const isLoadingProfileRef = useRef(false);

  const clearSession = () => {
    setUser(null);
    setIsAuthenticated(false);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('last_active_chat');
  };

  const loadProfile = async (userId: string) => {
    // ✅ Jika sedang loading profile, skip — hindari concurrent call
    if (isLoadingProfileRef.current) {
      console.warn('loadProfile: sudah berjalan, skip duplikat call');
      return;
    }
    isLoadingProfileRef.current = true;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // ✅ Abaikan AbortError — bukan error fatal
        if (isAbortError(error)) {
          console.warn('loadProfile: AbortError diabaikan (lock conflict)');
          return;
        }
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        console.error('Load profile error:', msg);
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
        setIsAuthenticated(true);
      }
    } catch (err: unknown) {
      // ✅ Abaikan AbortError di level exception juga
      if (isAbortError(err)) {
        console.warn('loadProfile: AbortError diabaikan (lock conflict)');
        return;
      }
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('loadProfile exception:', msg);
    } finally {
      isLoadingProfileRef.current = false;
    }
  };

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
          console.warn('Token refresh failed — logging out');
          clearSession();
          setIsLoading(false);
          return;
        }

        if (event === 'SIGNED_OUT') {
          clearSession();
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          clearSession();
        }

        setIsLoading(false);
      }
    );

    const handleVisibility = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          if (isAbortError(error)) {
            console.warn('handleVisibility: AbortError diabaikan');
            return;
          }
          console.warn('Session check failed:', error.message);
          clearSession();
          return;
        }
        if (!session && isAuthenticated) {
          clearSession();
        }
      } catch (err) {
        if (isAbortError(err)) {
          console.warn('handleVisibility: AbortError diabaikan');
          return;
        }
        console.warn('Visibility session check failed:', err);
        clearSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw new Error(error.message);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
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
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<User>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        age: updates.age,
        location: updates.location,
        consultation_purpose: updates.consultationPurpose,
        avatar: updates.avatar,
      })
      .eq('id', session.user.id);

    if (error) throw new Error(error.message);
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return {
    user,
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