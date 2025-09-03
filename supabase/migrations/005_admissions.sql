-- Create custom types for admissions
CREATE TYPE admission_status AS ENUM ('submitted', 'under_review', 'accepted', 'rejected');
CREATE TYPE prior_degree_type AS ENUM ('bac', 'licence', 'master', 'equivalent');

-- Admissions table
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    national_id VARCHAR NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    prior_degree prior_degree_type NOT NULL,
    gpa_or_score VARCHAR,
    program_track VARCHAR,
    pdf_url VARCHAR NOT NULL,
    status admission_status DEFAULT 'submitted',
    notes_admin TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_admissions_email ON admissions(email);
CREATE INDEX idx_admissions_national_id ON admissions(national_id);
CREATE INDEX idx_admissions_created_at ON admissions(created_at);
CREATE INDEX idx_admissions_status ON admissions(status);
CREATE INDEX idx_admissions_program_track ON admissions(program_track);

-- Create trigger for updated_at column
CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON admissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
