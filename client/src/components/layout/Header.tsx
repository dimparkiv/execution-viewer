import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  workflowName?: string | null;
  executionId?: string | null;
}

export default function Header({ workflowName, executionId }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <div className="breadcrumb">
          <a href="/viewer">Executions</a>
          {workflowName && (
            <>
              <span className="sep">/</span>
              <span className="workflow-name">{workflowName}</span>
            </>
          )}
          {executionId && (
            <>
              <span className="sep">/</span>
              <span style={{ color: 'var(--text-muted)' }}>#{executionId}</span>
            </>
          )}
        </div>
      </div>
      <div className="header-right">
        {user?.role === 'admin' && (
          <a href="/admin" className="header-btn">Admin</a>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{user?.name || user?.email}</span>
        <button className="header-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
