'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Dashboard } from '@/components/admin/Dashboard';
import { KnowledgeBase } from '@/components/admin/KnowledgeBase';
import { UserManagement } from '@/components/admin/UserManagement';
import { ChatMonitor } from '@/components/admin/ChatMonitor';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

type AdminPage = 'dashboard' | 'knowledge' | 'users' | 'chat' | 'settings';

const pageTitles: Record<AdminPage, string> = {
  dashboard: 'Dashboard',
  knowledge: 'Knowledge Base RAG',
  users: 'Manajemen User',
  chat: 'Monitor Chat',
  settings: 'Pengaturan Sistem',
};

export default function AdminLayout() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <Dashboard />;
      case 'knowledge':   return <KnowledgeBase />;
      case 'users':       return <UserManagement />;
      case 'chat':        return <ChatMonitor />;
      case 'settings':    return <SystemSettings />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: 'hidden' }}>
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          height: '61px', borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', background: isDark ? '#080F1E' : '#F8FAFC',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, letterSpacing: '-0.3px' }}>
            {pageTitles[activePage]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: '12px', color: t.textSecondary }}>Sistem Online</span>
            <button style={{
              background: 'none', border: `1px solid ${t.border}`,
              borderRadius: '8px', padding: '6px 8px',
              cursor: 'pointer', color: t.textSecondary, display: 'flex',
              alignItems: 'center', transition: 'all 0.2s',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}