import { useState, useRef, useCallback, useEffect } from 'react';
import CanvasNode from './CanvasNode';
import { CanvasConnectionPath, CanvasConnectionBadge } from './CanvasConnection';
import ZoomControls from './ZoomControls';
import '../../styles/canvas.css';

interface CanvasProps {
  nodes: any[];
  connections: any[];
  onNodeClick: (nodeId: string) => void;
}

export default function Canvas({ nodes, connections, onNodeClick }: CanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node')) return;
    setIsPanning(true);
    startPan.current = { x: e.clientX - panX, y: e.clientY - panY };
  }, [panX, panY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      setPanX(e.clientX - startPan.current.x);
      setPanY(e.clientY - startPan.current.y);
    };
    const handleMouseUp = () => setIsPanning(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => {
        const newZoom = Math.max(0.1, Math.min(2.5, prev * factor));
        const ratio = newZoom / prev;
        setPanX(px => mx - (mx - px) * ratio);
        setPanY(py => my - (my - py) * ratio);
        return newZoom;
      });
    } else if (e.shiftKey) {
      setPanX(prev => prev - e.deltaY);
    } else {
      setPanY(prev => prev - e.deltaY);
    }
  }, []);

  const zoomToFit = useCallback(() => {
    if (nodes.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const padding = 80;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.position[0]);
      minY = Math.min(minY, n.position[1]);
      maxX = Math.max(maxX, n.position[0] + 75);
      maxY = Math.max(maxY, n.position[1] + 100);
    });

    const contentW = maxX - minX + padding * 2;
    const contentH = maxY - minY + padding * 2;
    const newZoom = Math.min(rect.width / contentW, rect.height / contentH, 1.5);

    setPanX((rect.width - contentW * newZoom) / 2 - minX * newZoom + padding * newZoom);
    setPanY((rect.height - contentH * newZoom) / 2 - minY * newZoom + padding * newZoom);
    setZoom(newZoom);
  }, [nodes]);

  // Auto-fit on first load
  const fitted = useRef(false);
  useEffect(() => {
    if (nodes.length > 0 && !fitted.current) {
      fitted.current = true;
      setTimeout(zoomToFit, 50);
    }
  }, [nodes, zoomToFit]);

  // Reset fitted flag when nodes change
  useEffect(() => {
    fitted.current = false;
  }, [nodes]);

  return (
    <>
      <div
        ref={containerRef}
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          className="canvas"
          style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }}
        >
          <div className="canvas-grid" />

          {/* SVG connections */}
          <svg className="connections-svg" style={{ position: 'absolute' }}>
            <defs>
              <marker id="arrowhead-success" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M2,2 L10,6 L2,10 L4,6 Z" fill="var(--success)" />
              </marker>
              <marker id="arrowhead-error" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M2,2 L10,6 L2,10 L4,6 Z" fill="var(--error)" />
              </marker>
              <marker id="arrowhead-not-executed" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M2,2 L10,6 L2,10 L4,6 Z" fill="var(--not-executed)" />
              </marker>
            </defs>
            {connections.map((conn, i) => (
              <CanvasConnectionPath key={i} connection={conn} nodes={nodes} />
            ))}
          </svg>

          {/* Nodes layer */}
          <div className="nodes-layer">
            {nodes.map(node => (
              <CanvasNode key={node.id} node={node} onClick={onNodeClick} />
            ))}
          </div>

          {/* Connection badges */}
          <div className="badges-layer">
            {connections.map((conn, i) => (
              <CanvasConnectionBadge key={i} connection={conn} nodes={nodes} />
            ))}
          </div>
        </div>
      </div>

      <ZoomControls
        onZoomIn={() => setZoom(z => Math.min(2.5, z * 1.2))}
        onZoomOut={() => setZoom(z => Math.max(0.1, z * 0.8))}
        onReset={() => { setZoom(1); setPanX(0); setPanY(0); }}
        onFit={zoomToFit}
      />
    </>
  );
}
