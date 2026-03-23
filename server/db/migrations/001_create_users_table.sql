CREATE TABLE IF NOT EXISTS app_users (
    id            SERIAL PRIMARY KEY,
    google_id     VARCHAR(255) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    name          VARCHAR(255),
    avatar_url    TEXT,
    role          VARCHAR(20) DEFAULT 'pending'
                  CHECK (role IN ('pending', 'viewer', 'editor', 'admin')),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
