import JsonViewer from '../node-detail/JsonViewer';

interface SetRendererProps {
  parameters: Record<string, any>;
}

export default function SetRenderer({ parameters }: SetRendererProps) {
  const assignments = parameters.assignments?.assignments || parameters.values;

  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      {parameters.mode && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Mode: </span>
          <span style={{ color: 'var(--text)' }}>{parameters.mode}</span>
        </div>
      )}
      {assignments ? (
        <div>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Assignments</div>
          <JsonViewer data={assignments} />
        </div>
      ) : (
        <JsonViewer data={parameters} />
      )}
    </div>
  );
}
