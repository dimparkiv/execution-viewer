interface RoleSelectProps {
  value: string;
  onChange: (role: string) => void;
  disabled?: boolean;
}

export default function RoleSelect({ value, onChange, disabled }: RoleSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        background: '#2a2a2a',
        color: '#f5f5f5',
        border: '1px solid #444',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '0.85rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
}
