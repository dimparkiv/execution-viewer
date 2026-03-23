import { useState } from 'react';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import ParametersTab from './ParametersTab';
import SettingsTab from './SettingsTab';
import { getNodeIcon } from '../../utils/nodeIcons';

interface NodeDetailPanelProps {
  node: any;
  nodes: any[];
  executionData: any;
  onClose: () => void;
}

export default function NodeDetailPanel({ node, nodes, executionData, onClose }: NodeDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'parameters' | 'settings'>('parameters');
  const typeName = node.type.replace('n8n-nodes-base.', '').replace('CUSTOM.', '').replace('@n8n/n8n-nodes-langchain.', '');
  const icon = getNodeIcon(node.type);
  const isTrigger = node.type?.includes('Trigger') || node.type?.includes('trigger') || node.type?.includes('webhook');

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', zIndex: 2000,
        display: 'flex', alignItems: 'stretch', justifyContent: 'center',
        padding: '40px 20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-panel)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{ width: 24, height: 24 }}
              dangerouslySetInnerHTML={{ __html: icon }}
            />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>{node.name}</span>
            <span style={{ color: 'var(--text-dark)', fontSize: '11px' }}>{typeName} v{node.typeVersion}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '18px', padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Three-column layout */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* Left: Input */}
          <div style={{
            width: isTrigger ? 0 : '30%',
            borderRight: isTrigger ? 'none' : '1px solid var(--border)',
            overflow: 'hidden',
            display: isTrigger ? 'none' : 'flex',
            flexDirection: 'column',
          }}>
            <InputPanel node={node} nodes={nodes} executionData={executionData} />
          </div>

          {/* Center: Parameters/Settings */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              padding: '0 12px',
            }}>
              <button
                onClick={() => setActiveTab('parameters')}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'parameters' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeTab === 'parameters' ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >Parameters</button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'settings' ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeTab === 'settings' ? 'var(--text)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >Settings</button>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {activeTab === 'parameters' ? (
                <ParametersTab node={node} />
              ) : (
                <SettingsTab node={node} />
              )}
            </div>
          </div>

          {/* Right: Output */}
          <div style={{
            width: '30%',
            borderLeft: '1px solid var(--border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <OutputPanel node={node} executionData={executionData} />
          </div>
        </div>
      </div>
    </div>
  );
}
