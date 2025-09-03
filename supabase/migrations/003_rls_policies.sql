-- Row Level Security (RLS) Policies for Master BDSI

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- Courses table policies
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all courses" ON courses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('admin', 'editor')
    )
  );

-- Projects table policies
CREATE POLICY "Anyone can view active projects" ON projects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('admin', 'editor')
    )
  );

-- News table policies
CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT USING (is_active = true AND published_at IS NOT NULL);

CREATE POLICY "Authenticated users can view all news" ON news
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage news" ON news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('admin', 'editor')
    )
  );

-- Events table policies
CREATE POLICY "Anyone can view active events" ON events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and editors can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('admin', 'editor')
    )
  );

-- Faculty table policies
CREATE POLICY "Anyone can view active faculty" ON faculty
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all faculty" ON faculty
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage faculty" ON faculty
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- Partnerships table policies
CREATE POLICY "Anyone can view active partnerships" ON partnerships
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all partnerships" ON partnerships
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage partnerships" ON partnerships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- Testimonials table policies
CREATE POLICY "Anyone can view active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all testimonials" ON testimonials
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- Settings table policies
CREATE POLICY "Anyone can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- Create function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM users 
    WHERE id = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is editor or admin
CREATE OR REPLACE FUNCTION is_editor_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role() IN ('admin', 'editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 