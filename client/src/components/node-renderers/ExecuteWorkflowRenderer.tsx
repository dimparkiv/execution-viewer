import JsonViewer from '../node-detail/JsonViewer';

interface ExecuteWorkflowRendererProps {
  parameters: Record<string, any>;
}

export default function ExecuteWorkflowRenderer({ parameters }: ExecuteWorkflowRendererProps) {
  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      {parameters.source && (
        <ParamRow label="Source" value={parameters.source} />
      )}
      {parameters.workflowId && (
        <ParamRow label="Workflow ID" value={typeof parameters.workflowId === 'object' ? parameters.workflowId.value : parameters.workflowId} />
      )}
      {parameters.mode && (
        <ParamRow label="Mode" value={parameters.mode} />
      )}
      {parameters.options && Object.keys(parameters.options).length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Options</div>
          <JsonViewer data={parameters.options} />
        </div>
      )}
    </div>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: '140px', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--text)' }}>{value}</span>
    </div>
  );
}
