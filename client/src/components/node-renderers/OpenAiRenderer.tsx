import JsonViewer from '../node-detail/JsonViewer';

interface OpenAiRendererProps {
  parameters: Record<string, any>;
}

export default function OpenAiRenderer({ parameters }: OpenAiRendererProps) {
  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      {parameters.resource && (
        <ParamRow label="Resource" value={parameters.resource} />
      )}
      {parameters.operation && (
        <ParamRow label="Operation" value={parameters.operation} />
      )}
      {parameters.model && (
        <ParamRow label="Model" value={typeof parameters.model === 'object' ? parameters.model.value : parameters.model} />
      )}
      {parameters.prompt && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Prompt</div>
          <pre style={{
            background: 'var(--bg-darker)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '8px', fontSize: '11px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text)',
          }}>
            {typeof parameters.prompt === 'string' ? parameters.prompt : JSON.stringify(parameters.prompt, null, 2)}
          </pre>
        </div>
      )}
      {parameters.messages && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Messages</div>
          <JsonViewer data={parameters.messages} />
        </div>
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
