interface ExecutionItemProps {
  execution: {
    id: string;
    status: string;
    startedAt: string;
    duration: number | null;
  };
  isActive: boolean;
  onClick: () => void;
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function ExecutionItem({ execution, isActive, onClick }: ExecutionItemProps) {
  return (
    <div className={`exec-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className={`exec-status-bar ${execution.status}`} />
      <div className="exec-content">
        <div className="exec-date">{formatDate(execution.startedAt)}</div>
        <div className="exec-meta">
          <span className={`status ${execution.status}`}>
            {execution.status === 'success' ? 'Success' : 'Error'}
          </span>
          <span className="duration">· {formatDuration(execution.duration)}</span>
          <span className="duration">· #{execution.id}</span>
        </div>
      </div>
    </div>
  );
}
