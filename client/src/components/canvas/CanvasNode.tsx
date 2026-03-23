import { getNodeIcon, getNodeHeight, getPortYPosition } from '../../utils/nodeIcons';
import { NODE_WIDTH } from '../../utils/constants';

interface CanvasNodeProps {
  node: {
    id: string;
    name: string;
    type: string;
    status: string;
    position: [number, number];
    hasRun: boolean;
    outputData: any[];
    outputCount: number;
    inputSources: any[];
  };
  onClick: (nodeId: string) => void;
}

export default function CanvasNode({ node, onClick }: CanvasNodeProps) {
  const typeName = node.type
    .replace('n8n-nodes-base.', '')
    .replace('CUSTOM.', '')
    .replace('@n8n/n8n-nodes-langchain.', '');

  const inputPortCount = node.inputSources?.length || 0;
  const outputPortCount = node.outputData?.length || 1;
  const nodeHeight = getNodeHeight(inputPortCount, outputPortCount);

  const icon = getNodeIcon(node.type);

  // Badge
  let badge = null;
  if (node.status === 'success') {
    badge = (
      <div className="node-badge success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  } else if (node.status === 'error') {
    badge = (
      <div className="node-badge error">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 20h20L12 2z" />
          <path fill="#fff" d="M11 8h2v5h-2zM11 15h2v2h-2z" />
        </svg>
      </div>
    );
  }

  // Input ports
  const inputPorts = inputPortCount > 0 ? (
    <div className="node-ports-left" style={{ position: 'absolute', left: -3, top: 0, height: nodeHeight }}>
      {Array.from({ length: inputPortCount }, (_, i) => (
        <div
          key={i}
          className="node-port"
          style={{ position: 'absolute', top: getPortYPosition(i, inputPortCount, nodeHeight), transform: 'translateY(-50%)' }}
        />
      ))}
    </div>
  ) : null;

  // Output ports
  const outputPorts = outputPortCount > 0 ? (
    <div className="node-ports-right" style={{ position: 'absolute', right: 5, top: 0, height: nodeHeight }}>
      {Array.from({ length: outputPortCount }, (_, i) => (
        <div
          key={i}
          className="node-port"
          style={{ position: 'absolute', top: getPortYPosition(i, outputPortCount, nodeHeight), transform: 'translateY(-50%)' }}
        />
      ))}
    </div>
  ) : null;

  return (
    <div
      className={`node ${node.status}`}
      style={{ left: node.position[0], top: node.position[1] }}
      onClick={() => onClick(node.id)}
    >
      <div className="node-box" style={{ width: NODE_WIDTH, height: nodeHeight }}>
        {inputPorts}
        <div
          className={`node-icon ${typeName}`}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
        {outputPorts}
        {badge}
      </div>
      <div className="node-labels" style={{ top: nodeHeight + 7 }}>
        <div className="node-name" title={node.name}>{node.name}</div>
        <div className="node-type">{typeName}</div>
      </div>
    </div>
  );
}
