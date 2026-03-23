import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/viewer');
    } else if (user?.role === 'pending') {
      navigate('/pending');
    }
  }, [isAuthenticated, user, navigate]);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    setLoginError(null);
    try {
      await login(response.credential);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      console.error('Login failed:', msg);
      setLoginError(msg);
    }
  }, [login]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      const btnEl = document.getElementById('google-btn');
      if (btnEl) {
        window.google?.accounts.id.renderButton(btnEl, {
          theme: 'filled_black',
          size: 'large',
          width: 280,
        });
      }
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [handleCredentialResponse]);

  return (
    <div style={{
      background: '#141414',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#7c5cfc' }}>
        n8n Execution Viewer
      </h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Sign in to continue</p>
      <div id="google-btn" />
      {loginError && (
        <p style={{
          marginTop: '1rem',
          color: '#ff6b6b',
          fontSize: '0.85rem',
          maxWidth: 320,
          textAlign: 'center',
        }}>
          {loginError}
        </p>
      )}
    </div>
  );
}
