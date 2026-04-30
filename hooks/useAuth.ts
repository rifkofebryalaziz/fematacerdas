'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ Fix #1: Gunakan useRef agar instance tidak berubah tiap render
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    // ✅ Fix #2: Cek session awal secara eksplisit
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    // ✅ Fix #3: Listener visibilitychange untuk re-validasi session
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        const { data: { session } } = await supabase.auth.getSession();
        // Kalau session sudah hilang tapi state masih "login"
        if (!session && isAuthenticated) {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // Catatan: isAuthenticated sengaja tidak dimasukkan deps
  // agar listener tidak re-register setiap state berubah.
  // Gunakan ref jika linter komplain (lihat catatan di bawah)

  const loadProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Load profile error:', error);
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
  };

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
      options: { redirectTo: `${window.location.origin}/auth/callback` },
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
    // State akan di-clear oleh onAuthStateChange listener di atas
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