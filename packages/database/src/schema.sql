-- Users table (Clerk will be primary auth, this syncs user data)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE, -- NULL for anonymous chats
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  requirements JSONB, -- Structured requirements data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (for when chat converts to actual project)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chat_session_id UUID REFERENCES chat_sessions(id),
  name TEXT NOT NULL,
  description TEXT,
  requirements JSONB,
  status TEXT CHECK (status IN ('proposal', 'in_progress', 'completed', 'cancelled')) DEFAULT 'proposal',
  budget_range TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Chat sessions: users can see their own, anonymous sessions readable by anyone (for conversion)
CREATE POLICY "Users can view own chat sessions" ON chat_sessions FOR SELECT USING (
  user_id IS NULL OR auth.uid()::text = user_id
);
CREATE POLICY "Users can create chat sessions" ON chat_sessions FOR INSERT WITH CHECK (
  user_id IS NULL OR auth.uid()::text = user_id
);
CREATE POLICY "Users can update own chat sessions" ON chat_sessions FOR UPDATE USING (
  user_id IS NULL OR auth.uid()::text = user_id
);

-- Chat messages: follow session permissions
CREATE POLICY "Users can view messages from accessible sessions" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND (chat_sessions.user_id IS NULL OR auth.uid()::text = chat_sessions.user_id)
  )
);
CREATE POLICY "Users can create messages in accessible sessions" ON chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_sessions 
    WHERE chat_sessions.id = chat_messages.session_id 
    AND (chat_sessions.user_id IS NULL OR auth.uid()::text = chat_sessions.user_id)
  )
);

-- Projects: users can only see their own
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid()::text = user_id);
