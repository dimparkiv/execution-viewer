import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPatch, apiDelete } from '../api/client';
import UserTable from '../components/admin/UserTable';

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiGet<{ users: User[] }>('/api/admin/users');
      setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const pendingUsers = users.filter(u => u.role === 'pending');
  const activeUsers = users.filter(u => u.role !== 'pending');

  const handleApprove = async (userId: number, role: string) => {
    await apiPatch(`/api/admin/users/${userId}`, { role });
    fetchUsers();
  };

  const handleRoleChange = async (userId: number, role: string) => {
    await apiPatch(`/api/admin/users/${userId}`, { role });
    fetchUsers();
  };

  const handleDelete = async (userId: number) => {
    await apiDelete(`/api/admin/users/${userId}`);
    fetchUsers();
  };

  return (
    <div style={{
      background: '#141414',
      minHeight: '100vh',
      color: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid #2a2a2a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/viewer" style={{ color: '#7c5cfc', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Viewer
          </a>
          <h1 style={{ fontSize: '1.2rem', margin: 0 }}>User Management</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>{currentUser?.email}</span>
          <button onClick={logout} style={{
            background: '#333', color: '#f5f5f5', border: '1px solid #555',
            borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.85rem',
          }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
          <>
            {/* Pending users */}
            {pendingUsers.length > 0 && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1rem', color: '#ffaa00', marginBottom: '12px' }}>
                  Pending Approval ({pendingUsers.length})
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {pendingUsers.map(user => (
                    <div key={user.id} style={{
                      background: '#1e1e1e',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '16px',
                      width: '280px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        {user.avatar_url && (
                          <img src={user.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.name || '—'}</div>
                          <div style={{ color: '#888', fontSize: '0.8rem' }}>{user.email}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '12px' }}>
                        Registered: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(user.id, 'viewer')}
                          style={{
                            flex: 1, padding: '6px', background: '#1a3a1a', color: '#4caf50',
                            border: '1px solid #2a5a2a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
                          }}
                        >Approve (Viewer)</button>
                        <button
                          onClick={() => handleApprove(user.id, 'editor')}
                          style={{
                            flex: 1, padding: '6px', background: '#1a2a3a', color: '#64b5f6',
                            border: '1px solid #2a3a5a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
                          }}
                        >Editor</button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={{
                            padding: '6px 10px', background: '#3a1a1a', color: '#ff6b6b',
                            border: '1px solid #5a2a2a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem',
                          }}
                        >Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active users */}
            <section>
              <h2 style={{ fontSize: '1rem', marginBottom: '12px' }}>Active Users ({activeUsers.length})</h2>
              <div style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                <UserTable
                  users={activeUsers}
                  currentUserId={currentUser?.id}
                  onRoleChange={handleRoleChange}
                  onDelete={handleDelete}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
