interface SettingsTabProps {
  node: any;
}

export default function SettingsTab({ node }: SettingsTabProps) {
  const settings = [
    { label: 'Node ID', value: node.id },
    { label: 'Type', value: node.type },
    { label: 'Version', value: node.typeVersion },
    { label: 'Position', value: `[${node.position[0]}, ${node.position[1]}]` },
    { label: 'On Error', value: node.onError || 'stopWorkflow' },
    { label: 'Status', value: node.status },
  ];

  if (node.credentials?.length > 0) {
    settings.push({ label: 'Credentials', value: node.credentials.join(', ') });
  }

  return (
    <div style={{ padding: '12px' }}>
      <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
        <tbody>
          {settings.map(s => (
            <tr key={s.label} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 500, width: '120px' }}>
                {s.label}
              </td>
              <td style={{ padding: '8px', color: 'var(--text)' }}>{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
