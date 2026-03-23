import { useState, useCallback } from 'react';

interface JsonViewerProps {
  data: unknown;
  indent?: number;
}

function JsonValue({ data, indent = 0 }: JsonViewerProps) {
  if (data === null) return <span className="json-null">null</span>;
  if (data === undefined) return <span className="json-null">undefined</span>;
  if (typeof data === 'boolean') return <span className="json-boolean">{data.toString()}</span>;
  if (typeof data === 'number') return <span className="json-number">{data}</span>;
  if (typeof data === 'string') return <span className="json-string">"{data}"</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;
    return <CollapsibleArray data={data} indent={indent} />;
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data as Record<string, unknown>);
    if (keys.length === 0) return <span>{'{}'}</span>;
    return <CollapsibleObject data={data as Record<string, unknown>} indent={indent} />;
  }

  return <span>{String(data)}</span>;
}

function CollapsibleArray({ data, indent }: { data: unknown[]; indent: number }) {
  const [collapsed, setCollapsed] = useState(indent > 2);
  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed(c => !c);
  }, []);

  const pad = '  '.repeat(indent + 1);
  const closePad = '  '.repeat(indent);

  if (collapsed) {
    return (
      <span>
        <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>
          [{' '}
          <span style={{ color: 'var(--text-dark)' }}>...{data.length} items</span>
          {' ]'}
        </span>
      </span>
    );
  }

  return (
    <span>
      <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>[</span>
      {'\n'}
      {data.map((item, i) => (
        <span key={i}>
          {pad}
          <JsonValue data={item} indent={indent + 1} />
          {i < data.length - 1 ? ',' : ''}
          {'\n'}
        </span>
      ))}
      {closePad}
      <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>]</span>
    </span>
  );
}

function CollapsibleObject({ data, indent }: { data: Record<string, unknown>; indent: number }) {
  const [collapsed, setCollapsed] = useState(indent > 2);
  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed(c => !c);
  }, []);

  const keys = Object.keys(data);
  const pad = '  '.repeat(indent + 1);
  const closePad = '  '.repeat(indent);

  if (collapsed) {
    return (
      <span>
        <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>
          {'{ '}
          <span style={{ color: 'var(--text-dark)' }}>...{keys.length} properties</span>
          {' }'}
        </span>
      </span>
    );
  }

  return (
    <span>
      <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>{'{'}</span>
      {'\n'}
      {keys.map((key, i) => (
        <span key={key}>
          {pad}
          <span className="json-key">"{key}"</span>: <JsonValue data={data[key]} indent={indent + 1} />
          {i < keys.length - 1 ? ',' : ''}
          {'\n'}
        </span>
      ))}
      {closePad}
      <span className="json-toggle" onClick={toggle} style={{ cursor: 'pointer' }}>{'}'}</span>
    </span>
  );
}

export default function JsonViewer({ data }: JsonViewerProps) {
  return (
    <pre style={{
      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      fontSize: '12px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      margin: 0,
      padding: '12px',
      background: 'var(--bg-darker)',
      borderRadius: '4px',
      overflow: 'auto',
      maxHeight: '100%',
    }}>
      <JsonValue data={data} indent={0} />
    </pre>
  );
}
