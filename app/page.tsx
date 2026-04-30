'use client';

import React, { useState } from 'react';
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
import { useChatContext } from '@/context/ChatContext';
import { Settings } from '@/types';

type AuthPage = 'login' | 'register' | 'forgot-password';

export default function Home() {
  const [authPage, setAuthPage] = useState<AuthPage>('login');
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

  const { user, isAuthenticated, login, register, loginWithGoogle, forgotPassword, logout, updateProfile } = useAuthContext();
  const { chats, activeChat, messages, createNewChat, selectChat, deleteChat, toggleStarChat, sendMessage, getCurrentChatTitle } = useChatContext();

  const handleSelectChat = (id: string) => {
    setShowRecommendations(false);
    selectChat(id);
  };

  const handleNewChat = () => {
    setShowRecommendations(false);
    createNewChat();
  };

  if (!isAuthenticated) {
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
        />
      )}

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} chatTitle={getCurrentChatTitle()} chatId={activeChat} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onUpdateProfile={updateProfile} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} settings={settings} onUpdateSettings={setSettings} />
    </div>
  );
}