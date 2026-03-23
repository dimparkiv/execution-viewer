import { useState, useMemo } from 'react';
import JsonViewer from './JsonViewer';

interface InputPanelProps {
  node: any;
  nodes: any[];
  executionData: any;
}

export default function InputPanel({ node, nodes, executionData }: InputPanelProps) {
  const runData = executionData?.data?.resultData?.runData || {};

  // Find input source nodes from connections
  const inputSources = useMemo(() => {
    if (!node.inputSources || node.inputSources.length === 0) return [];
    // inputSources is an array of arrays, each containing source info
    const sources: { nodeId: string; nodeName: string }[] = [];
    node.inputSources.forEach((sourceArr: any) => {
      if (Array.isArray(sourceArr)) {
        sourceArr.forEach((s: any) => {
          if (s?.previousNode) {
            const srcNode = nodes.find((n: any) => n.name === s.previousNode);
            if (srcNode) {
              sources.push({ nodeId: srcNode.id, nodeName: srcNode.name });
            }
          }
        });
      }
    });
    return sources;
  }, [node, nodes]);

  const [selectedSource, setSelectedSource] = useState(inputSources[0]?.nodeName || '');

  // Get input data from source node's output
  const inputData = useMemo(() => {
    if (!selectedSource) return [];
    const sourceRuns = runData[selectedSource] || [];
    if (sourceRuns.length === 0) return [];
    const lastRun = sourceRuns[sourceRuns.length - 1];
    const mainData = lastRun?.data?.main || [];
    return mainData.flat().map((item: any) => item?.json || item);
  }, [selectedSource, runData]);

  const isTrigger = node.type?.includes('Trigger') || node.type?.includes('trigger') || node.type?.includes('webhook');

  if (isTrigger) {
    return (
      <div style={{ padding: '16px', color: 'var(--text-dark)', textAlign: 'center', fontSize: '12px' }}>
        Trigger nodes have no input
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
      }}>
        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>INPUT</span>
        {inputSources.length > 1 && (
          <select
            value={selectedSource}
            onChange={e => setSelectedSource(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '11px',
            }}
          >
            {inputSources.map(s => (
              <option key={s.nodeId} value={s.nodeName}>{s.nodeName}</option>
            ))}
          </select>
        )}
        <span style={{ color: 'var(--text-dark)' }}>{inputData.length} item{inputData.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {inputData.length > 0 ? (
          <JsonViewer data={inputData} />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '12px' }}>
            No input data
          </div>
        )}
      </div>
    </div>
  );
}
