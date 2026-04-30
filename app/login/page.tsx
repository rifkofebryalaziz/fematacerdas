'use client';

import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/chat');
  };

  const handleSwitchToRegister = () => {
    router.push('/register');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onSwitchToRegister={handleSwitchToRegister}
    />
  );
}