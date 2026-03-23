import RoleSelect from './RoleSelect';

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  created_at: string;
}

interface UserTableProps {
  users: User[];
  currentUserId?: number;
  onRoleChange: (userId: number, role: string) => void;
  onDelete: (userId: number) => void;
}

export default function UserTable({ users, currentUserId, onRoleChange, onDelete }: UserTableProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>User</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Joined</th>
          <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
            <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.avatar_url && (
                <img src={user.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
              )}
              <span>{user.name || '—'}</span>
            </td>
            <td style={{ padding: '8px', color: '#aaa' }}>{user.email}</td>
            <td style={{ padding: '8px' }}>
              <RoleSelect
                value={user.role}
                onChange={role => onRoleChange(user.id, role)}
                disabled={user.id === currentUserId}
              />
            </td>
            <td style={{ padding: '8px', color: '#888' }}>
              {new Date(user.created_at).toLocaleDateString()}
            </td>
            <td style={{ padding: '8px', textAlign: 'right' }}>
              {user.id !== currentUserId && (
                <button
                  onClick={() => {
                    if (confirm(`Delete user ${user.email}?`)) onDelete(user.id);
                  }}
                  style={{
                    background: '#3a1a1a',
                    color: '#ff6b6b',
                    border: '1px solid #5a2a2a',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
