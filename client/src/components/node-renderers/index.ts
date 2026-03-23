import { ComponentType } from 'react';
import WebhookRenderer from './WebhookRenderer';
import HttpRequestRenderer from './HttpRequestRenderer';
import CodeRenderer from './CodeRenderer';
import IfRenderer from './IfRenderer';
import OpenAiRenderer from './OpenAiRenderer';
import SetRenderer from './SetRenderer';
import ExecuteWorkflowRenderer from './ExecuteWorkflowRenderer';
import ExecuteWorkflowTriggerRenderer from './ExecuteWorkflowTriggerRenderer';
import GenericRenderer from './GenericRenderer';

const rendererMap: Record<string, ComponentType<{ parameters: Record<string, any> }>> = {
  'n8n-nodes-base.webhook': WebhookRenderer,
  'n8n-nodes-base.respondToWebhook': WebhookRenderer,
  'n8n-nodes-base.httpRequest': HttpRequestRenderer,
  'n8n-nodes-base.code': CodeRenderer,
  'n8n-nodes-base.function': CodeRenderer,
  'n8n-nodes-base.if': IfRenderer,
  'n8n-nodes-base.switch': IfRenderer,
  '@n8n/n8n-nodes-langchain.openAi': OpenAiRenderer,
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': OpenAiRenderer,
  'n8n-nodes-base.set': SetRenderer,
  'n8n-nodes-base.executeWorkflow': ExecuteWorkflowRenderer,
  'n8n-nodes-base.executeWorkflowTrigger': ExecuteWorkflowTriggerRenderer,
};

export function getRenderer(nodeType: string): ComponentType<{ parameters: Record<string, any> }> {
  return rendererMap[nodeType] || GenericRenderer;
}
