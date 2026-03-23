import { useMemo } from 'react';
import JsonViewer from './JsonViewer';

interface OutputPanelProps {
  node: any;
  executionData: any;
}

export default function OutputPanel({ node, executionData }: OutputPanelProps) {
  const runData = executionData?.data?.resultData?.runData || {};

  const { outputData, hasError, error, executionTime, startTime } = useMemo(() => {
    const nodeRuns = runData[node.name] || [];
    if (nodeRuns.length === 0) {
      return { outputData: null, hasError: false, error: null, executionTime: null, startTime: null };
    }
    const lastRun = nodeRuns[nodeRuns.length - 1];

    if (lastRun.error) {
      return {
        outputData: null,
        hasError: true,
        error: lastRun.error,
        executionTime: lastRun.executionTime,
        startTime: lastRun.startTime,
      };
    }

    const mainData = lastRun?.data?.main || [];
    const items = mainData.flat().map((item: any) => item?.json || item);
    return {
      outputData: items,
      hasError: false,
      error: null,
      executionTime: lastRun.executionTime,
      startTime: lastRun.startTime,
    };
  }, [node.name, runData]);

  const itemCount = outputData?.length || (hasError ? 1 : 0);

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
        <span style={{
          fontWeight: 600,
          color: hasError ? 'var(--error)' : node.hasRun ? 'var(--success)' : 'var(--text-muted)',
        }}>
          {hasError ? '✕ OUTPUT' : node.hasRun ? '✓ OUTPUT' : 'OUTPUT'}
        </span>
        <span style={{ color: 'var(--text-dark)' }}>
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
      </div>

      {executionTime !== null && (
        <div style={{
          padding: '4px 12px',
          fontSize: '10px',
          color: 'var(--text-dark)',
          borderBottom: '1px solid var(--border)',
        }}>
          {startTime && new Date(startTime).toLocaleTimeString()} · {executionTime}ms
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {hasError ? (
          <div style={{
            background: 'rgba(255,97,110,0.1)',
            border: '1px solid var(--error)',
            borderRadius: '4px',
            padding: '12px',
            fontSize: '12px',
          }}>
            <div style={{ color: 'var(--error)', fontWeight: 600, marginBottom: '8px' }}>
              Error
            </div>
            <div style={{ color: 'var(--text)', marginBottom: '4px' }}>
              {error?.message || 'Unknown error'}
            </div>
            {error?.description && (
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                {error.description}
              </div>
            )}
            {error?.stack && (
              <pre style={{
                marginTop: '8px',
                fontSize: '10px',
                color: 'var(--text-dark)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {error.stack}
              </pre>
            )}
          </div>
        ) : outputData ? (
          <JsonViewer data={outputData} />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '12px' }}>
            Node not executed
          </div>
        )}
      </div>
    </div>
  );
}
