'use client';

import React, { useState, useCallback } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { CollapsedSidebar } from '@/components/sidebar/CollapsedSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { RecommendationPage } from '@/components/recommendations/RecommendationPage';
import { ShareModal } from '@/components/modals/ShareModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { useAuthContext } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { useChatContext } from '@/context/ChatContext';
import { Settings } from '@/types';

type AuthPage = 'login' | 'register' | 'forgot-password';

// ✅ Pisahkan komponen utama agar ChatProvider hanya mount SETELAH user authenticated.
// Ini mencegah useChat jalan sebelum ada session valid.
function AuthenticatedApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    aiResponse: 'detail',
    tone: 'formal',
    medicalDisclaimer: true,
    showSource: true,
    saveHistory: true,
    locationPermission: false,
    searchRadius: 5,
    recommendationType: 'semua',
    sortBy: 'terdekat',
    autoDeleteDays: null,
  });

  const { user, logout, updateProfile } = useAuthContext();
  const {
    chats, activeChat, messages, isLoadingMessages,
    createNewChat, selectChat, deleteChat, toggleStarChat,
    sendMessage, getCurrentChatTitle,
  } = useChatContext();

  const handleSelectChat = useCallback((id: string) => {
    setShowRecommendations(false);
    selectChat(id);
  }, [selectChat]);

  const handleNewChat = useCallback(() => {
    setShowRecommendations(false);
    createNewChat();
  }, [createNewChat]);

  // user tidak mungkin null di sini karena sudah dicek di Home()
  if (!user) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {sidebarCollapsed ? (
        <CollapsedSidebar
          onToggle={() => setSidebarCollapsed(false)}
          onNewChat={handleNewChat}
          user={user}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onLogout={logout}
          onOpenRecommendations={() => setShowRecommendations(true)}
        />
      ) : (
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={deleteChat}
          onStarChat={toggleStarChat}
          onToggle={() => setSidebarCollapsed(true)}
          user={user}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onLogout={logout}
          onOpenRecommendations={() => setShowRecommendations(true)}
        />
      )}

      {showRecommendations ? (
        <RecommendationPage onBack={() => setShowRecommendations(false)} settings={settings} />
      ) : (
        <ChatArea
          messages={messages}
          onSendMessage={sendMessage}
          chatTitle={getCurrentChatTitle()}
          onShare={() => setShowShareModal(true)}
          isLoadingMessages={isLoadingMessages}
        />
      )}

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        chatTitle={getCurrentChatTitle()}
        chatId={activeChat}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdateProfile={updateProfile}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}

export default function Home() {
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  const {
    isAuthenticated,
    isLoading,   // ✅ FIX Bug Arsitektur 2: tunggu isLoading selesai dulu
    user,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
  } = useAuthContext();

  // ✅ FIX: Saat isLoading = true, jangan render apapun (bukan LoginForm, bukan App).
  // Ini mencegah flicker ke LoginForm saat tab di-restore dan session masih valid.
  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080F1E',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(14,165,233,0.2)',
          borderTopColor: '#0EA5E9',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Belum login — tampilkan auth forms
  if (!isAuthenticated || !user) {
    if (authPage === 'forgot-password') {
      return (
        <ForgotPasswordForm
          onBack={() => setAuthPage('login')}
          onResetPassword={async (email) => { await forgotPassword(email); }}
        />
      );
    }

    if (authPage === 'register') {
      return (
        <RegisterForm
          onRegister={async (name, email, password) => {
            await register(name, email, password);
          }}
          onSwitchToLogin={() => setAuthPage('login')}
          onGoogleLogin={loginWithGoogle}
        />
      );
    }

    return (
      <LoginForm
        onLogin={async (email, password) => {
          await login(email, password);
        }}
        onSwitchToRegister={() => setAuthPage('register')}
        onGoogleLogin={loginWithGoogle}
        onForgotPassword={() => setAuthPage('forgot-password')}
      />
    );
  }

  // ✅ FIX: ChatProvider hanya mount SETELAH authenticated.
  // Ini memastikan useChat langsung dapat isAuthenticated=true saat pertama kali jalan,
  // sehingga loadChats() terpanggil dengan benar dan tidak ada race condition.
  return (
    <ChatProvider>
      <AuthenticatedApp />
    </ChatProvider>
  );
}