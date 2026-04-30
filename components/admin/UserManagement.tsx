'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

const MOCK_USERS = [
  { id: '1', name: 'Ahmad Rifai', email: 'ahmad@gmail.com', totalChat: 42, lastActive: '2 jam lalu', status: 'aktif', color: '#0EA5E9' },
  { id: '2', name: 'Siti Rahayu', email: 'siti@gmail.com', totalChat: 28, lastActive: '1 hari lalu', status: 'aktif', color: '#8B5CF6' },
  { id: '3', name: 'Budi Santoso', email: 'budi@gmail.com', totalChat: 7, lastActive: '32 hari lalu', status: 'nonaktif', color: '#F59E0B' },
  { id: '4', name: 'Dewi Kusuma', email: 'dewi@gmail.com', totalChat: 156, lastActive: '3 jam lalu', status: 'aktif', color: '#10B981' },
  { id: '5', name: 'Hendra Wijaya', email: 'hendra@gmail.com', totalChat: 19, lastActive: '5 hari lalu', status: 'aktif', color: '#F43F5E' },
];

export function UserManagement() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterActivity, setFilterActivity] = useState('semua');

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'semua' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const selectStyle = { background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '9px', padding: '8px 12px', color: t.textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" };

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total User', value: '248', color: t.accent },
          { label: 'Aktif Hari Ini', value: '143', color: '#10B981' },
          { label: 'Nonaktif', value: '12', color: '#F43F5E' },
        ].map((s) => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '9px 14px' }}>
          <Search size={14} color={t.textSecondary} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari user berdasarkan nama atau email..."
            style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: '13px', flex: 1, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="semua">Semua User</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
        <select value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} style={selectStyle}>
          <option value="semua">Semua Aktivitas</option>
          <option value="today">Aktif Hari Ini</option>
          <option value="week">Aktif Minggu Ini</option>
          <option value="inactive">Tidak Aktif 30 Hari</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['User', 'Email', 'Total Chat', 'Terakhir Aktif', 'Status', 'Aksi'].map((h) => (
                <th key={h} style={{ fontSize: '10px', fontWeight: 600, color: t.textSecondary, letterSpacing: '1px', textTransform: 'uppercase', padding: '13px 16px', textAlign: 'left', borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(14,165,233,0.03)' : 'rgba(37,99,235,0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '13px 16px', borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${user.color}, ${user.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}>{user.name[0]}</span>
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: t.textPrimary }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: '13px', color: t.textSecondary, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>{user.email}</td>
                <td style={{ padding: '13px 16px', fontSize: '13.5px', fontWeight: 600, color: t.textPrimary, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>{user.totalChat}</td>
                <td style={{ padding: '13px 16px', fontSize: '13px', color: t.textSecondary, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>{user.lastActive}</td>
                <td style={{ padding: '13px 16px', borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>
                  {user.status === 'aktif'
                    ? <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>● Aktif</span>
                    : <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(244,63,94,0.1)', color: '#F43F5E' }}>● Nonaktif</span>
                  }
                </td>
                <td style={{ padding: '13px 16px', borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(0,0,0,0.04)'}` }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
                    >Detail</button>
                    {user.status === 'aktif'
                      ? <button style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.08)', color: '#F43F5E', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Nonaktifkan</button>
                      : <button style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.08)', color: '#10B981', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Aktifkan</button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}