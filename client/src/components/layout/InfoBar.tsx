interface InfoBarProps {
  executionId?: string | null;
  workflowName?: string | null;
  status?: string | null;
  startedAt?: string | null;
  stoppedAt?: string | null;
  stats?: { totalNodes: number; executedNodes: number; errorNodes: number } | null;
}

function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function InfoBar({ executionId, workflowName, status, startedAt, stoppedAt, stats }: InfoBarProps) {
  if (!executionId) {
    return (
      <div className="info-bar empty">
        <span className="info-empty-text">Select an execution to view details</span>
      </div>
    );
  }

  return (
    <div className="info-bar">
      <div className="info-left">
        {startedAt && (
          <span className="exec-datetime">
            {new Date(startedAt).toLocaleString()}
          </span>
        )}
        {status && (
          <span className={`exec-status-badge ${status}`}>
            {status === 'success' ? '✓' : status === 'error' ? '✕' : '⟳'}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
        <span className="exec-id">#{executionId}</span>
        {startedAt && stoppedAt && (
          <span className="exec-id">{formatDuration(startedAt, stoppedAt)}</span>
        )}
      </div>
      <div className="info-right">
        {stats && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {stats.executedNodes}/{stats.totalNodes} nodes
            {stats.errorNodes > 0 && (
              <span style={{ color: 'var(--error)' }}> · {stats.errorNodes} errors</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
