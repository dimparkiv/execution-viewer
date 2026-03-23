import ExecutionItem from './ExecutionItem';

interface Execution {
  id: string;
  status: string;
  startedAt: string;
  duration: number | null;
}

interface ExecutionListProps {
  executions: Execution[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function ExecutionList({
  executions,
  activeId,
  onSelect,
  onLoadMore,
  hasMore,
  loading,
}: ExecutionListProps) {
  if (executions.length === 0 && !loading) {
    return (
      <div className="exec-empty">
        <div className="exec-empty-icon">📋</div>
        <div className="exec-empty-text">
          Enter a Workflow ID and click Search to load executions
        </div>
      </div>
    );
  }

  return (
    <div className="exec-list">
      {executions.map(exec => (
        <ExecutionItem
          key={exec.id}
          execution={exec}
          isActive={exec.id === activeId}
          onClick={() => onSelect(exec.id)}
        />
      ))}
      {hasMore && onLoadMore && (
        <button className="load-more" onClick={onLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
