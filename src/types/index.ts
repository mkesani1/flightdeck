// FlightDeck Type Definitions

export type BusinessStage = 'idea' | 'plan' | 'design' | 'build' | 'test' | 'launch' | 'grow' | 'scale';
export type AgentType = 'dev' | 'email' | 'content' | 'analytics' | 'research' | 'design';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type InterventionType = 'approval' | 'decision' | 'review' | 'clarification' | 'error';
export type ActivityType = 'success' | 'info' | 'warning' | 'error';
export type ModuleType = 'product' | 'money' | 'legal' | 'marketing' | 'sales' | 'operations';

export interface Business {
  id: string;
  org_id: string;
  name: string;
  tagline?: string;
  stage: BusinessStage;
  color: string;
  avatar_initials?: string;
  github_repo?: string;
  ga_property_id?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  emoji: string;
  is_global: boolean;
}

export interface AgentAssignment {
  id: string;
  business_id: string;
  agent_id: string;
  is_active: boolean;
  agent?: Agent;
  business?: Business;
}

export interface Task {
  id: string;
  business_id: string;
  agent_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  module?: ModuleType;
  created_at: string;
  completed_at?: string;
  agent?: Agent;
  business?: Business;
}

export interface Intervention {
  id: string;
  business_id: string;
  agent_id?: string;
  type: InterventionType;
  title: string;
  context?: string;
  options?: { label: string; value: string }[];
  status: 'pending' | 'resolved' | 'dismissed';
  slack_sent: boolean;
  created_at: string;
  resolved_at?: string;
  agent?: Agent;
  business?: Business;
}

export interface ActivityFeedItem {
  id: string;
  business_id: string;
  agent_id?: string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  agent?: Agent;
  business?: Business;
}

export interface BusinessMetrics {
  id: string;
  business_id: string;
  date: string;
  mrr: number;
  customers: number;
  leads: number;
  visitors: number;
  trials: number;
  readiness_pct: number;
}

// Stats for Live Operations
export interface LiveStats {
  tasksToday: number;
  completed: number;
  inProgress: number;
  needsYou: number;
}

// Agent with current task info for Live Ops
export interface ActiveAgent {
  agent: Agent;
  currentTask?: string;
  business?: Business;
  isActive: boolean;
}
