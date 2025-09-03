-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for better data validation
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'editor');
CREATE TYPE project_theme AS ENUM ('IA/ML', 'Data Engineering', 'NLP', 'Computer Vision', 'IoT');
CREATE TYPE news_category AS ENUM ('event', 'research', 'success_story', 'announcement');
CREATE TYPE event_type AS ENUM ('seminar', 'defense', 'workshop', 'meetup');
CREATE TYPE partnership_type AS ENUM ('company', 'laboratory', 'institution');
CREATE TYPE setting_type AS ENUM ('text', 'number', 'boolean', 'json');

-- Sessions table (for authentication)
CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create index for session expiration
CREATE INDEX IDX_session_expire ON sessions(expire);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    semester INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    objectives TEXT,
    objectives_en TEXT,
    objectives_ar TEXT,
    prerequisites TEXT,
    prerequisites_en TEXT,
    prerequisites_ar TEXT,
    evaluation TEXT,
    evaluation_en TEXT,
    evaluation_ar TEXT,
    resources TEXT,
    resources_en TEXT,
    resources_ar TEXT,
    instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    summary TEXT,
    summary_en TEXT,
    summary_ar TEXT,
    methodology TEXT,
    methodology_en TEXT,
    methodology_ar TEXT,
    results TEXT,
    results_en TEXT,
    results_ar TEXT,
    theme project_theme NOT NULL,
    year INTEGER NOT NULL,
    students TEXT, -- JSON array of student names
    supervisors TEXT, -- JSON array of supervisor names
    keywords TEXT, -- JSON array
    awards TEXT, -- JSON array
    documents TEXT, -- JSON array of document URLs
    video_url VARCHAR,
    image_url VARCHAR,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- News table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    summary TEXT,
    summary_en TEXT,
    summary_ar TEXT,
    content TEXT,
    content_en TEXT,
    content_ar TEXT,
    category news_category NOT NULL,
    image_url VARCHAR,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    type event_type NOT NULL,
    location TEXT,
    location_en TEXT,
    location_ar TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    speakers TEXT, -- JSON array
    registration_url VARCHAR,
    documents_url VARCHAR,
    image_url VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Faculty table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    name_ar TEXT,
    title TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    specialization TEXT,
    specialization_en TEXT,
    specialization_ar TEXT,
    bio TEXT,
    bio_en TEXT,
    bio_ar TEXT,
    research TEXT,
    research_en TEXT,
    research_ar TEXT,
    email VARCHAR,
    phone VARCHAR,
    linkedin_url VARCHAR,
    website_url VARCHAR,
    profile_image_url VARCHAR,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Partnerships table
CREATE TABLE partnerships (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    name_ar TEXT,
    type partnership_type NOT NULL,
    description TEXT,
    description_en TEXT,
    description_ar TEXT,
    logo_url VARCHAR,
    website_url VARCHAR,
    contact_email VARCHAR,
    contact_person TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    role_en TEXT,
    role_ar TEXT,
    content TEXT NOT NULL,
    content_en TEXT,
    content_ar TEXT,
    company TEXT,
    image_url VARCHAR,
    graduation_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    "key" VARCHAR NOT NULL UNIQUE,
    value TEXT,
    value_en TEXT,
    value_ar TEXT,
    type setting_type DEFAULT 'text',
    category VARCHAR DEFAULT 'general',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feature flags table for page visibility
CREATE TABLE feature_flags (
    id SERIAL PRIMARY KEY,
    "key" VARCHAR NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_active ON courses(is_active);

CREATE INDEX idx_projects_theme ON projects(theme);
CREATE INDEX idx_projects_year ON projects(year);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_active ON projects(is_active);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_news_featured ON news(is_featured);
CREATE INDEX idx_news_published ON news(published_at);
CREATE INDEX idx_news_active ON news(is_active);

CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_active ON events(is_active);

CREATE INDEX idx_faculty_user ON faculty(user_id);
CREATE INDEX idx_faculty_order ON faculty("order");
CREATE INDEX idx_faculty_active ON faculty(is_active);

CREATE INDEX idx_partnerships_type ON partnerships(type);
CREATE INDEX idx_partnerships_active ON partnerships(is_active);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_active ON testimonials(is_active);

CREATE INDEX idx_settings_key ON settings("key");
CREATE INDEX idx_settings_category ON settings(category);

CREATE INDEX idx_feature_flags_key ON feature_flags("key");
CREATE INDEX idx_feature_flags_enabled ON feature_flags(enabled);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON partnerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 