import JsonViewer from '../node-detail/JsonViewer';

interface GenericRendererProps {
  parameters: Record<string, unknown>;
}

export default function GenericRenderer({ parameters }: GenericRendererProps) {
  if (!parameters || Object.keys(parameters).length === 0) {
    return <div style={{ color: 'var(--text-dark)', fontSize: '12px', padding: '12px' }}>No parameters</div>;
  }
  return <JsonViewer data={parameters} />;
}
