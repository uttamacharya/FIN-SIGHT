CREATE TABLE IF NOT EXISTS Users(
    id UUID PRIMARY KEY DECIMAL gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(30),
    is_email_varified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)