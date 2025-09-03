-- Seed feature flags for page visibility
INSERT INTO feature_flags ("key", enabled) VALUES
    ('home', true),
    ('program', true),
    ('admissions', true),
    ('projects', true),
    ('news', true),
    ('events', true),
    ('faculty', true),
    ('partnerships', true),
    ('alumni', true),
    ('contact', true)
ON CONFLICT ("key") DO NOTHING;
