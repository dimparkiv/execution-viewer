interface CodeRendererProps {
  parameters: Record<string, any>;
}

export default function CodeRenderer({ parameters }: CodeRendererProps) {
  const code = parameters.jsCode || parameters.code || parameters.functionCode || '';
  const language = parameters.language || 'javaScript';

  return (
    <div style={{ padding: '12px', fontSize: '12px' }}>
      {parameters.mode && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Mode: </span>
          <span style={{ color: 'var(--text)' }}>{parameters.mode}</span>
        </div>
      )}
      <div style={{ marginBottom: '4px', color: 'var(--text-muted)' }}>
        Language: {language}
      </div>
      <pre style={{
        background: 'var(--bg-darker)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '11px',
        lineHeight: '1.5',
        overflow: 'auto',
        maxHeight: '400px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        color: 'var(--text)',
      }}>
        {code}
      </pre>
    </div>
  );
}
