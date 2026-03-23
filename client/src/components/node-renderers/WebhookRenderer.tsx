interface WebhookRendererProps {
  parameters: Record<string, any>;
}

export default function WebhookRenderer({ parameters }: WebhookRendererProps) {
  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      <ParamRow label="HTTP Method" value={parameters.httpMethod || 'GET'} />
      <ParamRow label="Path" value={parameters.path || '/'} />
      <ParamRow label="Authentication" value={parameters.authentication || 'none'} />
      <ParamRow label="Response Mode" value={parameters.responseMode || 'onReceived'} />
      {parameters.options && Object.keys(parameters.options).length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Options</div>
          {Object.entries(parameters.options).map(([k, v]) => (
            <ParamRow key={k} label={k} value={String(v)} />
          ))}
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
