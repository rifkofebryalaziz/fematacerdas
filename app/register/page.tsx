'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/chat');
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <RegisterForm
      onRegister={handleRegister}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}