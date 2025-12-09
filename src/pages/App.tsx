import React, { useState, useEffect } from 'react';
import Login from '@/components/Login';
import MainPage from '@/pages/Index';
import ResetPassword from '@/pages/ResetPassword';
import { supabase } from '@/lib/supabase';

type ViewMode = 'login' | 'reset' | 'app';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');

      if (type === 'recovery') {
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setViewMode('reset');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          setViewMode('app');
        }
      }

      setLoading(false);
    };

    checkAuthAndRecovery();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && viewMode !== 'reset') {
        setIsAuthenticated(true);
        setViewMode('app');
      } else if (!session && viewMode === 'app') {
        setIsAuthenticated(false);
        setViewMode('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [viewMode]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setViewMode('app');
  };

  const handleResetSuccess = async () => {
    await supabase.auth.signOut();
    setViewMode('login');
  };

  const handleResetCancel = async () => {
    await supabase.auth.signOut();
    setViewMode('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'reset') {
    return (
      <ResetPassword
        onSuccess={handleResetSuccess}
        onCancel={handleResetCancel}
      />
    );
  }

  if (!isAuthenticated || viewMode === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainPage />;
}
