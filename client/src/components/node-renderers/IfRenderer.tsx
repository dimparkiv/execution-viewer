import JsonViewer from '../node-detail/JsonViewer';

interface IfRendererProps {
  parameters: Record<string, any>;
}

export default function IfRenderer({ parameters }: IfRendererProps) {
  const conditions = parameters.conditions;

  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      {conditions ? (
        <div>
          <div style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>Conditions</div>
          <JsonViewer data={conditions} />
        </div>
      ) : (
        <JsonViewer data={parameters} />
      )}
    </div>
  );
}
