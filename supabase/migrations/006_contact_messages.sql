-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR,
    organization TEXT,
    reason VARCHAR NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
