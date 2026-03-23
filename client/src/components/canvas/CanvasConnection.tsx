import { generateConnectionPath, getConnectionMidpoint } from '../../utils/connectionPath';
import { getNodeHeight, getPortYPosition } from '../../utils/nodeIcons';
import { NODE_WIDTH } from '../../utils/constants';

interface ConnectionData {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  fromPort: number;
  toPort: number;
  itemCount: number;
}

interface NodeData {
  id: string;
  status: string;
  position: [number, number];
  hasRun: boolean;
  outputData: any[];
  inputSources: any[];
}

interface CanvasConnectionProps {
  connection: ConnectionData;
  nodes: NodeData[];
}

export function CanvasConnectionPath({ connection, nodes }: CanvasConnectionProps) {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);
  if (!fromNode || !toNode) return null;

  const fromOutputCount = fromNode.outputData?.length || 1;
  const fromInputCount = fromNode.inputSources?.length || 0;
  const toInputCount = toNode.inputSources?.length || 1;
  const toOutputCount = toNode.outputData?.length || 1;

  const fromNodeHeight = getNodeHeight(fromInputCount, fromOutputCount);
  const toNodeHeight = getNodeHeight(toInputCount, toOutputCount);

  const fromPortY = getPortYPosition(connection.fromPort, fromOutputCount, fromNodeHeight);
  const toPortY = getPortYPosition(connection.toPort, toInputCount, toNodeHeight);

  const sourceX = fromNode.position[0] + NODE_WIDTH;
  const sourceY = fromNode.position[1] + fromPortY;
  const targetX = toNode.position[0];
  const targetY = toNode.position[1] + toPortY;

  const pathD = generateConnectionPath(sourceX, sourceY, targetX, targetY);
  const status = connection.itemCount === 0 ? 'not-executed' : fromNode.status;

  return <path className={`conn-path ${status}`} d={pathD} />;
}

export function CanvasConnectionBadge({ connection, nodes }: CanvasConnectionProps) {
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);
  if (!fromNode || !toNode || !fromNode.hasRun || connection.itemCount <= 0) return null;

  const fromOutputCount = fromNode.outputData?.length || 1;
  const fromInputCount = fromNode.inputSources?.length || 0;
  const toInputCount = toNode.inputSources?.length || 1;
  const toOutputCount = toNode.outputData?.length || 1;

  const fromNodeHeight = getNodeHeight(fromInputCount, fromOutputCount);
  const toNodeHeight = getNodeHeight(toInputCount, toOutputCount);

  const fromPortY = getPortYPosition(connection.fromPort, fromOutputCount, fromNodeHeight);
  const toPortY = getPortYPosition(connection.toPort, toInputCount, toNodeHeight);

  const sourceX = fromNode.position[0] + NODE_WIDTH;
  const sourceY = fromNode.position[1] + fromPortY;
  const targetX = toNode.position[0];
  const targetY = toNode.position[1] + toPortY;

  const midpoint = getConnectionMidpoint(sourceX, sourceY, targetX, targetY);
  const badgeStatus = fromNode.status === 'error' ? 'error' : fromNode.status === 'success' ? 'success' : '';
  const itemText = connection.itemCount === 1 ? '1 item' : `${connection.itemCount} items`;

  return (
    <div
      className={`conn-badge ${badgeStatus}`}
      style={{ left: midpoint.x, top: midpoint.y - 12 }}
    >
      {itemText}
    </div>
  );
}
