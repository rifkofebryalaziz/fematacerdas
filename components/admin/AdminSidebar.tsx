'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

type AdminPage = 'dashboard' | 'knowledge' | 'users' | 'chat' | 'settings';

interface AdminSidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
}

const navItems = [
  {
    section: 'Utama',
    items: [
      {
        id: 'dashboard' as AdminPage,
        label: 'Dashboard',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Konten',
    items: [
      {
        id: 'knowledge' as AdminPage,
        label: 'Knowledge Base',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Monitoring',
    items: [
      {
        id: 'users' as AdminPage,
        label: 'Manajemen User',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
      {
        id: 'chat' as AdminPage,
        label: 'Monitor Chat',
        badge: 3,
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Sistem',
    items: [
      {
        id: 'settings' as AdminPage,
        label: 'Pengaturan Sistem',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/>
          </svg>
        ),
      },
    ],
  },
];

export function AdminSidebar({ activePage, onNavigate }: AdminSidebarProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: isDark ? '#080F1E' : '#F8FAFC',
      borderRight: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      transition: 'all 0.4s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{
          width: '36px', height: '36px',
          background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '10px',
          boxShadow: `0 4px 16px ${t.accentGlow}`,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div style={{ fontSize: '17px', fontWeight: 700, color: t.textPrimary, letterSpacing: '-0.4px' }}>
          MataCerdas
        </div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: t.accent, letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.8, marginTop: '2px' }}>
          Admin Panel
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '14px 12px', flex: 1 }}>
        {navItems.map((section) => (
          <div key={section.section}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: t.textSecondary, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '10px 10px 6px', opacity: 0.6 }}>
              {section.section}
            </div>
            {section.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px', border: isActive ? `1px solid rgba(14,165,233,0.2)` : '1px solid transparent',
                    background: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
                    color: isActive ? t.accent : t.textSecondary,
                    fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.2s ease', marginBottom: '2px',
                    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(14,165,233,0.06)'; e.currentTarget.style.color = t.textPrimary; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textSecondary; } }}
                >
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span style={{ background: '#F43F5E', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '20px', minWidth: '18px', textAlign: 'center' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer - Admin Profile */}
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${t.border}`, opacity: 0.85 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14,165,233,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: `0 2px 8px ${t.accentGlow}`,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>A</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</p>
            <p style={{ margin: 0, fontSize: '11px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>admin@matacerdas.id</p>
          </div>
        </div>
      </div>
    </aside>
  );
}