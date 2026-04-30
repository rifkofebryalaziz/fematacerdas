'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import AdminLayout from './layout';

export default function AdminPage() {
  return (
    <ThemeProvider>
      <AdminLayout />
    </ThemeProvider>
  );
}