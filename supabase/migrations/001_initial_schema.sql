-- FlightDeck Database Schema
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (user's account)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  slack_webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own organization" ON organizations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own organization" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own organization" ON organizations
  FOR UPDATE USING (auth.uid() = user_id);

-- Businesses (the 10+ startups)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  stage TEXT CHECK (stage IN ('idea', 'build', 'launch', 'grow', 'scale')) DEFAULT 'idea',
  color TEXT DEFAULT '#FF4405',
  avatar_initials TEXT,
  github_repo TEXT,
  ga_property_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own businesses" ON businesses
  FOR SELECT USING (
    org_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can insert own businesses" ON businesses
  FOR INSERT WITH CHECK (
    org_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can update own businesses" ON businesses
  FOR UPDATE USING (
    org_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can delete own businesses" ON businesses
  FOR DELETE USING (
    org_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
  );

-- Agents (AI workers - global, no RLS needed)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('dev', 'email', 'content', 'analytics', 'research', 'design')),
  emoji TEXT,
  is_global BOOLEAN DEFAULT true
);

-- Seed default agents
INSERT INTO agents (name, type, emoji) VALUES
  ('Dev Agent', 'dev', '🤖'),
  ('Email Agent', 'email', '📧'),
  ('Content Agent', 'content', '📝'),
  ('Analytics Agent', 'analytics', '📊'),
  ('Research Agent', 'research', '🔍'),
  ('Design Agent', 'design', '🎨');

-- Agent Assignments (which agents work on which business)
CREATE TABLE agent_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses ON DELETE CASCADE,
  agent_id UUID REFERENCES agents ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(business_id, agent_id)
);

-- Row Level Security for agent_assignments
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own agent assignments" ON agent_assignments
  FOR SELECT USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own agent assignments" ON agent_assignments
  FOR ALL USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses ON DELETE CASCADE,
  agent_id UUID REFERENCES agents,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')) DEFAULT 'pending',
  module TEXT CHECK (module IN ('product', 'money', 'legal', 'marketing', 'sales', 'operations')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Row Level Security for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Interventions (needs human input)
CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses ON DELETE CASCADE,
  agent_id UUID REFERENCES agents,
  type TEXT CHECK (type IN ('approval', 'decision', 'review', 'clarification', 'error')),
  title TEXT NOT NULL,
  context TEXT,
  options JSONB, -- for decision type
  status TEXT CHECK (status IN ('pending', 'resolved', 'dismissed')) DEFAULT 'pending',
  slack_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Row Level Security for interventions
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interventions" ON interventions
  FOR SELECT USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own interventions" ON interventions
  FOR ALL USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Activity Feed
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses ON DELETE CASCADE,
  agent_id UUID REFERENCES agents,
  type TEXT CHECK (type IN ('success', 'info', 'warning', 'error')),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security for activity_feed
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON activity_feed
  FOR SELECT USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert activity" ON activity_feed
  FOR INSERT WITH CHECK (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Business Metrics (for dashboard)
CREATE TABLE business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  mrr DECIMAL(10,2) DEFAULT 0,
  customers INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  visitors INTEGER DEFAULT 0,
  trials INTEGER DEFAULT 0,
  readiness_pct INTEGER DEFAULT 0,
  UNIQUE(business_id, date)
);

-- Row Level Security for business_metrics
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own metrics" ON business_metrics
  FOR SELECT USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage own metrics" ON business_metrics
  FOR ALL USING (
    business_id IN (
      SELECT b.id FROM businesses b
      JOIN organizations o ON b.org_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE interventions;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Indexes for better performance
CREATE INDEX idx_businesses_org_id ON businesses(org_id);
CREATE INDEX idx_tasks_business_id ON tasks(business_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_interventions_business_id ON interventions(business_id);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_activity_feed_business_id ON activity_feed(business_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX idx_business_metrics_business_date ON business_metrics(business_id, date);
