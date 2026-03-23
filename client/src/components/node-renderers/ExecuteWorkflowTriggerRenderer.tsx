import JsonViewer from '../node-detail/JsonViewer';

interface ExecuteWorkflowTriggerRendererProps {
  parameters: Record<string, any>;
}

export default function ExecuteWorkflowTriggerRenderer({ parameters }: ExecuteWorkflowTriggerRendererProps) {
  if (!parameters || Object.keys(parameters).length === 0) {
    return (
      <div style={{ padding: '12px', color: 'var(--text-dark)', fontSize: '12px' }}>
        This trigger is activated when called by another workflow
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      <JsonViewer data={parameters} />
    </div>
  );
}
