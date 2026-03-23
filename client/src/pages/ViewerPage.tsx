import { useState, useCallback } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import InfoBar from '../components/layout/InfoBar';
import Canvas from '../components/canvas/Canvas';
import NodeDetailPanel from '../components/node-detail/NodeDetailPanel';
import { useExecutions } from '../hooks/useExecutions';
import '../styles/globals.css';
import '../styles/node-detail.css';

export default function ViewerPage() {
  const {
    executions,
    workflowName,
    currentDetail,
    listLoading,
    detailLoading,
    fetchList,
    fetchDetails,
  } = useExecutions();

  const [currentWorkflowId, setCurrentWorkflowId] = useState('');
  const [activeExecId, setActiveExecId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSearch = useCallback((wfId: string) => {
    setCurrentWorkflowId(wfId);
    setActiveExecId(null);
    setSelectedNodeId(null);
    fetchList(wfId);
  }, [fetchList]);

  const handleSelectExecution = useCallback((id: string) => {
    setActiveExecId(id);
    setSelectedNodeId(null);
    fetchDetails(id);
  }, [fetchDetails]);

  const handleDirectLoad = useCallback((execId: string) => {
    setActiveExecId(execId);
    setSelectedNodeId(null);
    fetchDetails(execId);
  }, [fetchDetails]);

  const handleLoadMore = useCallback(() => {
    if (currentWorkflowId) {
      fetchList(currentWorkflowId, executions.length);
    }
  }, [currentWorkflowId, executions.length, fetchList]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const selectedNode = currentDetail?.nodes.find((n: any) => n.id === selectedNodeId);

  return (
    <div>
      <Header
        workflowName={currentDetail?.workflowName || workflowName}
        executionId={activeExecId}
      />
      <Sidebar
        executions={executions}
        activeId={activeExecId}
        onSearch={handleSearch}
        onSelectExecution={handleSelectExecution}
        onDirectLoad={handleDirectLoad}
        onLoadMore={handleLoadMore}
        hasMore={executions.length > 0 && executions.length % 500 === 0}
        loading={listLoading}
      />
      <InfoBar
        executionId={activeExecId}
        workflowName={currentDetail?.workflowName}
        status={currentDetail?.status}
        startedAt={currentDetail?.startedAt}
        stoppedAt={currentDetail?.stoppedAt}
        stats={currentDetail?.stats}
      />

      {detailLoading ? (
        <div className="canvas-container empty">
          <div className="canvas-empty">
            <div className="canvas-empty-text">Loading execution...</div>
          </div>
        </div>
      ) : !currentDetail ? (
        <div className="canvas-container empty">
          <div className="canvas-empty">
            <div className="canvas-empty-icon">&#128269;</div>
            <div className="canvas-empty-text">Select an execution to view</div>
          </div>
        </div>
      ) : (
        <Canvas
          nodes={currentDetail.nodes}
          connections={currentDetail.connections}
          onNodeClick={handleNodeClick}
        />
      )}

      {selectedNode && currentDetail && (
        <NodeDetailPanel
          node={selectedNode}
          nodes={currentDetail.nodes}
          executionData={currentDetail.execution}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
