import pool from '../db/pool';
import { config } from '../config';

export interface AppUser {
  id: number;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export async function findByGoogleId(googleId: string): Promise<AppUser | null> {
  const result = await pool.query('SELECT * FROM app_users WHERE google_id = $1', [googleId]);
  return result.rows[0] || null;
}

export async function findByEmail(email: string): Promise<AppUser | null> {
  const result = await pool.query('SELECT * FROM app_users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(data: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string;
}): Promise<AppUser> {
  const role = data.email === config.adminEmail ? 'admin' : 'pending';
  const result = await pool.query(
    `INSERT INTO app_users (google_id, email, name, avatar_url, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.googleId, data.email, data.name, data.avatarUrl, role]
  );
  return result.rows[0];
}

export async function updateRole(userId: number, role: string): Promise<AppUser> {
  const result = await pool.query(
    `UPDATE app_users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [role, userId]
  );
  return result.rows[0];
}

export async function getAllUsers(): Promise<AppUser[]> {
  const result = await pool.query(
    'SELECT * FROM app_users ORDER BY CASE WHEN role = \'pending\' THEN 0 ELSE 1 END, created_at DESC'
  );
  return result.rows;
}

export async function deleteUser(userId: number): Promise<void> {
  await pool.query('DELETE FROM app_users WHERE id = $1', [userId]);
}
