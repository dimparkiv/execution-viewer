import fs from 'fs';
import path from 'path';
import pool from './pool';

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    try {
      await pool.query(sql);
      console.log(`Migration ${file} applied`);
    } catch (error) {
      console.error(`Migration ${file} failed:`, error);
      throw error;
    }
  }

  await pool.end();
  console.log('All migrations complete');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
