import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { getExecutionList, getExecutionDetails } from '../services/execution.service';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['viewer', 'editor', 'admin']));

// List executions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { workflow_id, execution_id, offset, limit } = req.query;

    // If execution_id is provided, return details directly
    if (execution_id) {
      const data = await getExecutionDetails(execution_id as string);
      res.json(data);
      return;
    }

    if (!workflow_id) {
      res.status(400).json({ error: 'workflow_id is required' });
      return;
    }

    const data = await getExecutionList(
      workflow_id as string,
      parseInt((offset as string) || '0', 10),
      parseInt((limit as string) || '500', 10)
    );
    res.json(data);
  } catch (error: any) {
    console.error('Executions error:', error);
    res.status(error.message === 'Execution not found' ? 404 : 500).json({ error: error.message });
  }
});

// Get execution details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getExecutionDetails(req.params.id);
    res.json(data);
  } catch (error: any) {
    console.error('Execution detail error:', error);
    res.status(error.message === 'Execution not found' ? 404 : 500).json({ error: error.message });
  }
});

export default router;
