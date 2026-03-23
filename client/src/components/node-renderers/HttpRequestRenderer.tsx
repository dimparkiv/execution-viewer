import JsonViewer from '../node-detail/JsonViewer';

interface HttpRequestRendererProps {
  parameters: Record<string, any>;
}

export default function HttpRequestRenderer({ parameters }: HttpRequestRendererProps) {
  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      <ParamRow label="Method" value={parameters.method || parameters.requestMethod || 'GET'} />
      <ParamRow label="URL" value={parameters.url || ''} />
      {parameters.authentication && (
        <ParamRow label="Authentication" value={parameters.authentication} />
      )}
      {parameters.sendHeaders && parameters.headerParameters?.parameters && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Headers</div>
          <JsonViewer data={parameters.headerParameters.parameters} />
        </div>
      )}
      {parameters.sendBody && parameters.bodyParameters && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Body</div>
          <JsonViewer data={parameters.bodyParameters} />
        </div>
      )}
      {parameters.sendQuery && parameters.queryParameters?.parameters && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Query Parameters</div>
          <JsonViewer data={parameters.queryParameters.parameters} />
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
      <span style={{ color: 'var(--text)', wordBreak: 'break-all' }}>{value}</span>
    </div>
  );
}
