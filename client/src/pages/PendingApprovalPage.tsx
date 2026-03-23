import { useAuth } from '../contexts/AuthContext';

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();

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
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#7c5cfc' }}>
        Account Pending Approval
      </h1>
      <p style={{ color: '#888', marginBottom: '0.5rem' }}>
        Your account is pending administrator approval.
      </p>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>{user?.email}</p>
      <button
        onClick={logout}
        style={{
          padding: '8px 24px',
          background: '#333',
          color: '#f5f5f5',
          border: '1px solid #555',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Logout
      </button>
    </div>
  );
}
