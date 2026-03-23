import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from '../services/auth.service';
import { findByGoogleId, createUser } from '../services/user.service';
import { config } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Google login
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }

    const googleUser = await verifyGoogleToken(idToken);

    let user = await findByGoogleId(googleUser.googleId);
    if (!user) {
      user = await createUser(googleUser);
    }

    if (user.role === 'pending') {
      res.json({ status: 'pending', user: { email: user.email, name: user.name, avatar_url: user.avatar_url } });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({
      status: 'ok',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Auth error:', message);
    // Surface the real reason in dev; generic message in prod
    res.status(401).json({
      error: 'Authentication failed',
      detail: message, // TODO: hide in production once auth is working
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});

// Logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' });
  res.json({ status: 'ok' });
});

export default router;
