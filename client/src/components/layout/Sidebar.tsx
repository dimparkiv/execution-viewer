import { useState, FormEvent } from 'react';
import ExecutionList from '../execution-list/ExecutionList';

interface Execution {
  id: string;
  status: string;
  startedAt: string;
  duration: number | null;
}

interface SidebarProps {
  executions: Execution[];
  activeId: string | null;
  onSearch: (workflowId: string) => void;
  onSelectExecution: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  onDirectLoad?: (executionId: string) => void;
}

export default function Sidebar({
  executions,
  activeId,
  onSearch,
  onSelectExecution,
  onLoadMore,
  hasMore,
  loading,
  onDirectLoad,
}: SidebarProps) {
  const [workflowId, setWorkflowId] = useState('');
  const [executionId, setExecutionId] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (executionId.trim() && onDirectLoad) {
      onDirectLoad(executionId.trim());
    } else if (workflowId.trim()) {
      onSearch(workflowId.trim());
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Executions</span>
      </div>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Workflow ID"
          value={workflowId}
          onChange={e => setWorkflowId(e.target.value)}
        />
        <input
          className="search-input"
          type="text"
          placeholder="Execution ID (direct)"
          value={executionId}
          onChange={e => setExecutionId(e.target.value)}
        />
        <button
          className="search-submit"
          type="submit"
          disabled={loading || (!workflowId.trim() && !executionId.trim())}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
      <ExecutionList
        executions={executions}
        activeId={activeId}
        onSelect={onSelectExecution}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
    </aside>
  );
}
