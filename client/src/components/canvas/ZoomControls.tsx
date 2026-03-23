interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFit: () => void;
}

export default function ZoomControls({ onZoomIn, onZoomOut, onReset, onFit }: ZoomControlsProps) {
  return (
    <div className="zoom-controls">
      <button className="zoom-btn" onClick={onZoomIn} title="Zoom In">+</button>
      <button className="zoom-btn" onClick={onZoomOut} title="Zoom Out">-</button>
      <button className="zoom-btn" onClick={onReset} title="Reset">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <button className="zoom-btn" onClick={onFit} title="Fit">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );
}
