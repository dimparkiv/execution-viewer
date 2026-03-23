import { useState, useCallback } from 'react';
import { apiGet } from '../api/client';

interface ExecutionListItem {
  id: string;
  status: string;
  mode: string;
  startedAt: string;
  stoppedAt: string;
  duration: number | null;
  workflowId: string;
  workflowName: string;
}

interface ExecutionListResponse {
  success: boolean;
  workflowName: string | null;
  count: number;
  executions: ExecutionListItem[];
}

interface ExecutionDetail {
  success: boolean;
  executionId: string;
  workflowId: string;
  workflowName: string;
  status: string;
  mode: string;
  startedAt: string;
  stoppedAt: string;
  error: any;
  stats: { totalNodes: number; executedNodes: number; errorNodes: number };
  nodes: any[];
  connections: any[];
  execution: { id: string; data: any };
}

export function useExecutions() {
  const [executions, setExecutions] = useState<ExecutionListItem[]>([]);
  const [workflowName, setWorkflowName] = useState<string | null>(null);
  const [currentDetail, setCurrentDetail] = useState<ExecutionDetail | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async (workflowId: string, offset = 0, limit = 500) => {
    setListLoading(true);
    setError(null);
    try {
      const data = await apiGet<ExecutionListResponse>(
        `/api/executions?workflow_id=${encodeURIComponent(workflowId)}&offset=${offset}&limit=${limit}`
      );
      if (offset === 0) {
        setExecutions(data.executions);
      } else {
        setExecutions(prev => [...prev, ...data.executions]);
      }
      setWorkflowName(data.workflowName);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setListLoading(false);
    }
  }, []);

  const fetchDetails = useCallback(async (executionId: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const data = await apiGet<ExecutionDetail>(`/api/executions/${encodeURIComponent(executionId)}`);
      setCurrentDetail(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  return {
    executions,
    workflowName,
    currentDetail,
    listLoading,
    detailLoading,
    error,
    fetchList,
    fetchDetails,
  };
}
