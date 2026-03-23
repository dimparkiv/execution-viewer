import pool from '../db/pool';

interface ExecutionListItem {
  id: string;
  status: string;
  mode: string;
  startedAt: string;
  stoppedAt: string;
  duration: number | null;
  workflowId: string;
  workflowName: string;
  retryOf: string | null;
  retrySuccessId: string | null;
}

export async function getExecutionList(workflowId: string, offset = 0, limit = 500) {
  const result = await pool.query(
    'SELECT * FROM errors_executions WHERE workflow_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
    [workflowId, limit, offset]
  );

  const executions: ExecutionListItem[] = result.rows.map((row: any) => {
    const exec = row.execution;

    let duration: number | null = null;
    if (exec.startedAt && exec.stoppedAt) {
      duration = new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime();
    }

    return {
      id: exec.id,
      status: exec.status === 'success' ? 'success' : 'error',
      mode: exec.mode,
      startedAt: exec.startedAt,
      stoppedAt: exec.stoppedAt,
      duration,
      workflowId: exec.workflowId,
      workflowName: exec.workflowData?.name || 'Unknown Workflow',
      retryOf: exec.retryOf || null,
      retrySuccessId: exec.retrySuccessId || null,
    };
  });

  const workflowName = executions.length > 0 ? executions[0].workflowName : null;

  return {
    success: true,
    workflowName,
    count: executions.length,
    executions,
  };
}

export async function getExecutionDetails(executionId: string) {
  const result = await pool.query(
    'SELECT * FROM errors_executions WHERE execution_id = $1 LIMIT 1',
    [executionId]
  );

  if (result.rows.length === 0) {
    throw new Error('Execution not found');
  }

  const row = result.rows[0];
  const execution = row.execution;

  // Parse execution data if it's a string
  let execData = execution.data;
  if (typeof execData === 'string') {
    try {
      execData = JSON.parse(execData);
    } catch {
      execData = {};
    }
  }

  // Use the workflow snapshot stored inside the execution
  const workflow = execution.workflowData || {};

  const runData = execData?.resultData?.runData || {};
  const globalError = execData?.resultData?.error;

  // Determine overall status
  let status = 'success';
  if (globalError || execution.status === 'error' || execution.status === 'crashed') {
    status = 'error';
  } else if (execution.status === 'running' || execution.status === 'waiting') {
    status = 'running';
  }

  // Process nodes with their execution data
  const nodes = (workflow.nodes || []).map((node: any) => {
    const nodeRuns = runData[node.name] || [];
    const lastRun = nodeRuns[nodeRuns.length - 1];
    const hasRun = !!lastRun;
    const hasError = !!(lastRun?.error);

    let nodeStatus = 'not-executed';
    if (hasError) nodeStatus = 'error';
    else if (hasRun) nodeStatus = 'success';

    // Get output data
    const outputData = lastRun?.data?.main || [];
    const outputCount = outputData.reduce(
      (sum: number, arr: any[]) => sum + (arr?.length || 0),
      0
    );

    // Get input sources
    const inputSources = lastRun?.source || [];

    return {
      id: node.id,
      name: node.name,
      type: node.type,
      typeVersion: node.typeVersion || 1,
      position: node.position || [0, 0],
      parameters: node.parameters || {},
      onError: node.onError,
      credentials: node.credentials ? Object.keys(node.credentials) : [],
      status: nodeStatus,
      hasRun,
      hasError,
      error: lastRun?.error || null,
      startTime: lastRun?.startTime || null,
      executionTime: lastRun?.executionTime || null,
      inputSources,
      outputData,
      outputCount,
    };
  });

  // Process connections
  const connections: any[] = [];
  Object.entries(workflow.connections || {}).forEach(([fromName, outputs]: [string, any]) => {
    if (!outputs.main) return;
    outputs.main.forEach((targets: any[], outputIndex: number) => {
      if (!targets) return;
      targets.forEach((target: any) => {
        const fromNode = nodes.find((n: any) => n.name === fromName);
        const toNode = nodes.find((n: any) => n.name === target.node);
        if (fromNode && toNode) {
          // Aggregate item count across ALL runs for this output port
          let itemCount = 0;
          const nodeRuns = runData[fromName] || [];
          nodeRuns.forEach((run: any) => {
            const portData = run?.data?.main?.[outputIndex];
            if (portData) {
              itemCount += portData.length;
            }
          });

          connections.push({
            from: fromNode.id,
            fromName,
            to: toNode.id,
            toName: target.node,
            fromPort: outputIndex,
            toPort: target.index || 0,
            itemCount,
          });
        }
      });
    });
  });

  // Calculate stats
  const totalNodes = nodes.length;
  const executedNodes = nodes.filter((n: any) => n.hasRun).length;
  const errorNodes = nodes.filter((n: any) => n.hasError).length;

  return {
    success: true,
    executionId: execution.id,
    workflowId: workflow.id,
    workflowName: workflow.name,
    status,
    mode: execution.mode,
    startedAt: execution.startedAt,
    stoppedAt: execution.stoppedAt,
    retryOf: execution.retryOf,
    retrySuccessId: execution.retrySuccessId,
    error: globalError
      ? {
          message: globalError.message,
          nodeName: globalError.node?.name,
          nodeType: globalError.node?.type,
          stack: globalError.stack,
        }
      : null,
    stats: { totalNodes, executedNodes, errorNodes },
    nodes,
    connections,
    execution: { id: execution.id, data: execData },
  };
}
