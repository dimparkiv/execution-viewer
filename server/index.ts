import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { checkConnection } from './db/pool';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import executionRoutes from './routes/executions';

const app = express();

// Allow Google Sign-In popup to communicate back via postMessage
app.use((_req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(cors({
  origin: config.isProduction ? true : 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/executions', executionRoutes);

// Error handler
app.use(errorHandler);

// In production, serve static files from client/dist
if (config.isProduction) {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));

  // SPA fallback: any GET not matching /api/* → index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
  console.log(`GOOGLE_CLIENT_ID: ${config.googleClientId ? config.googleClientId.slice(0, 20) + '...' : '❌ NOT SET'}`);
  if (config.databaseUrl) {
    try {
      await checkConnection();
    } catch {
      console.warn('Database connection failed — continuing without DB');
    }
  }
});

export default app;
