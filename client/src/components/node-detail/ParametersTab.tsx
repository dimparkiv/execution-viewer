import { getRenderer } from '../node-renderers';

interface ParametersTabProps {
  node: any;
}

export default function ParametersTab({ node }: ParametersTabProps) {
  const params = node.parameters || {};
  const hasError = node.hasError && node.error;
  const Renderer = getRenderer(node.type);

  return (
    <div>
      {hasError && (
        <div style={{
          background: 'rgba(255,97,110,0.1)',
          border: '1px solid var(--error)',
          borderRadius: '4px',
          padding: '10px',
          margin: '12px',
          fontSize: '12px',
          color: 'var(--error)',
        }}>
          <strong>Error:</strong> {node.error?.message || 'Unknown error'}
        </div>
      )}
      <Renderer parameters={params} />
    </div>
  );
}
