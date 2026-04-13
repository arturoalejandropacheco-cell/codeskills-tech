-- codeskills.tech database schema
-- Migration: 001_initial_schema

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  bio TEXT,
  country TEXT,
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table (skills, rules, mcps, agents)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('skill', 'rule', 'mcp', 'agent', 'hook', 'plugin')),
  editors TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'pt')),
  github_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
  installs INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Installs tracking
CREATE TABLE installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  editor TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_slug ON items(slug);
CREATE INDEX idx_items_tags ON items USING GIN(tags);
CREATE INDEX idx_items_editors ON items USING GIN(editors);
CREATE INDEX idx_items_installs ON items(installs DESC);
CREATE INDEX idx_items_published_at ON items(published_at DESC);
CREATE INDEX idx_installs_item_id ON installs(item_id);
CREATE INDEX idx_installs_created_at ON installs(created_at DESC);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE installs ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Items: published are public, drafts only by author
CREATE POLICY "Published items are viewable by everyone"
  ON items FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can insert items"
  ON items FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own items"
  ON items FOR UPDATE USING (auth.uid() = author_id);

-- Installs: anyone can insert, public read
CREATE POLICY "Anyone can track installs"
  ON installs FOR INSERT WITH CHECK (true);

CREATE POLICY "Install stats are public"
  ON installs FOR SELECT USING (true);

-- Function to increment install count
CREATE OR REPLACE FUNCTION increment_install_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE items SET installs = installs + 1 WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_install_created
  AFTER INSERT ON installs
  FOR EACH ROW
  EXECUTE FUNCTION increment_install_count();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url, github_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Seed categories
INSERT INTO categories (name, slug, icon) VALUES
  ('React', 'react', '⚛️'),
  ('Next.js', 'nextjs', '▲'),
  ('TypeScript', 'typescript', '🔷'),
  ('Python', 'python', '🐍'),
  ('Django', 'django', '🎸'),
  ('FastAPI', 'fastapi', '⚡'),
  ('Laravel', 'laravel', '🔴'),
  ('Vue', 'vue', '💚'),
  ('Svelte', 'svelte', '🔥'),
  ('Go', 'go', '🐹'),
  ('Rust', 'rust', '🦀'),
  ('Node.js', 'nodejs', '💚'),
  ('Tailwind CSS', 'tailwindcss', '🎨'),
  ('Supabase', 'supabase', '⚡'),
  ('Docker', 'docker', '🐳'),
  ('Testing', 'testing', '🧪'),
  ('DevOps', 'devops', '🔧'),
  ('Seguridad', 'security', '🔒'),
  ('General', 'general', '📦');
