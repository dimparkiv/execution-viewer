import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const client = new OAuth2Client(config.googleClientId);

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid token payload');
  }

  return {
    googleId: payload.sub,
    email: payload.email || '',
    name: payload.name || '',
    avatarUrl: payload.picture || '',
  };
}
