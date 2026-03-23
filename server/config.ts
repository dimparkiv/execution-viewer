import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  jwtSecret: process.env.JWT_SECRET || 'change-me-to-random-string',
  adminEmail: process.env.ADMIN_EMAIL || '',
  isProduction: process.env.NODE_ENV === 'production',
};
