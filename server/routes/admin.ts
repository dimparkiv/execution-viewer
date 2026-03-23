import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { getAllUsers, updateRole, deleteUser } from '../services/user.service';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['admin']));

// List all users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role
router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { role } = req.body;

    if (!['pending', 'viewer', 'editor', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    if (userId === req.user?.userId) {
      res.status(400).json({ error: 'Cannot change your own role' });
      return;
    }

    const user = await updateRole(userId, role);
    res.json({ user });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete user
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (userId === req.user?.userId) {
      res.status(400).json({ error: 'Cannot delete yourself' });
      return;
    }

    await deleteUser(userId);
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
