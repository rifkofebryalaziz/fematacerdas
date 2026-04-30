'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page which contains the main app
    router.push('/');
  }, [router]);

  return null;
}