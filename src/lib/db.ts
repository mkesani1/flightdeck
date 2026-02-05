import { supabase } from './supabase';
import type { BusinessStage, AgentType } from '../types';

// Types matching our Supabase schema
export interface DbOrganization {
  id: string;
  user_id: string | null;
  name: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbBusiness {
  id: string;
  org_id: string;
  name: string;
  tagline: string | null;
  stage: BusinessStage;
  color: string;
  avatar_initials: string | null;
  github_connected: boolean;
  analytics_connected: boolean;
  slack_channel_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAgent {
  id: string;
  name: string;
  type: AgentType;
  emoji: string | null;
  description: string | null;
  is_global: boolean;
  created_at: string;
}

export interface DbIntervention {
  id: string;
  business_id: string;
  agent_id: string | null;
  type: 'approval' | 'decision' | 'review' | 'clarification' | 'error';
  title: string;
  context: string | null;
  options: { label: string; value: string }[] | null;
  status: 'pending' | 'resolved' | 'expired' | 'dismissed';
  resolution: string | null;
  slack_message_ts: string | null;
  slack_sent: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface DbActivityFeed {
  id: string;
  business_id: string;
  agent_id: string | null;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Organization operations
export async function createOrganization(name: string, userId?: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const { data, error } = await supabase
    .from('fd_organizations')
    .insert({ name, slug, user_id: userId || null })
    .select()
    .single();

  if (error) throw error;
  return data as DbOrganization;
}

export async function getOrganization(id: string) {
  const { data, error } = await supabase
    .from('fd_organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as DbOrganization;
}

export async function getOrCreateDefaultOrg() {
  // Try to get existing org
  const { data: existing } = await supabase
    .from('fd_organizations')
    .select('*')
    .limit(1)
    .single();

  if (existing) return existing as DbOrganization;

  // Create default org
  return createOrganization('My Organization');
}

// Business operations
export async function createBusiness(business: {
  orgId: string;
  name: string;
  tagline?: string;
  stage: BusinessStage;
  color: string;
  githubConnected?: boolean;
  analyticsConnected?: boolean;
}) {
  const avatarInitials = business.name.substring(0, 2).toUpperCase();

  const { data, error } = await supabase
    .from('fd_businesses')
    .insert({
      org_id: business.orgId,
      name: business.name,
      tagline: business.tagline || null,
      stage: business.stage,
      color: business.color,
      avatar_initials: avatarInitials,
      github_connected: business.githubConnected || false,
      analytics_connected: business.analyticsConnected || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DbBusiness;
}

export async function getBusinesses(orgId: string) {
  const { data, error } = await supabase
    .from('fd_businesses')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DbBusiness[];
}

export async function getBusiness(id: string) {
  const { data, error } = await supabase
    .from('fd_businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as DbBusiness;
}

export async function updateBusiness(id: string, updates: Partial<DbBusiness>) {
  const { data, error } = await supabase
    .from('fd_businesses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbBusiness;
}

// Agent operations
export async function getAgents() {
  const { data, error } = await supabase
    .from('fd_agents')
    .select('*')
    .eq('is_global', true)
    .order('name');

  if (error) throw error;
  return data as DbAgent[];
}

export async function assignAgentsToBusiness(businessId: string, agentIds: string[]) {
  // Remove existing assignments
  await supabase
    .from('fd_business_agents')
    .delete()
    .eq('business_id', businessId);

  // Add new assignments
  const assignments = agentIds.map(agentId => ({
    business_id: businessId,
    agent_id: agentId,
    is_active: true,
  }));

  const { error } = await supabase
    .from('fd_business_agents')
    .insert(assignments);

  if (error) throw error;
}

export async function getBusinessAgents(businessId: string) {
  const { data, error } = await supabase
    .from('fd_business_agents')
    .select(`
      *,
      agent:fd_agents(*)
    `)
    .eq('business_id', businessId)
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

// Intervention operations
export async function getInterventions(businessId?: string) {
  let query = supabase
    .from('fd_interventions')
    .select(`
      *,
      business:fd_businesses(*),
      agent:fd_agents(*)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (businessId) {
    query = query.eq('business_id', businessId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function resolveIntervention(id: string, resolution: string) {
  const { data, error } = await supabase
    .from('fd_interventions')
    .update({
      status: 'resolved',
      resolution,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbIntervention;
}

// Activity feed operations
export async function getActivityFeed(limit = 10, businessId?: string) {
  let query = supabase
    .from('fd_activity_feed')
    .select(`
      *,
      business:fd_businesses(*),
      agent:fd_agents(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (businessId) {
    query = query.eq('business_id', businessId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addActivityFeedItem(item: {
  businessId: string;
  agentId?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from('fd_activity_feed')
    .insert({
      business_id: item.businessId,
      agent_id: item.agentId || null,
      type: item.type,
      message: item.message,
      metadata: item.metadata || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DbActivityFeed;
}

// Workflow task operations
export async function getWorkflowTasks(businessId: string) {
  const { data, error } = await supabase
    .from('fd_workflow_tasks')
    .select(`
      *,
      agent:fd_agents(*)
    `)
    .eq('business_id', businessId)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function createWorkflowTask(task: {
  businessId: string;
  agentId: string;
  task: string;
  status?: 'pending' | 'active' | 'completed' | 'blocked';
  sortOrder?: number;
}) {
  const { data, error } = await supabase
    .from('fd_workflow_tasks')
    .insert({
      business_id: task.businessId,
      agent_id: task.agentId,
      task: task.task,
      status: task.status || 'pending',
      sort_order: task.sortOrder || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Stats
export async function getLiveStats(_orgId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: tasks, error: tasksError } = await supabase
    .from('fd_workflow_tasks')
    .select('status, business:fd_businesses!inner(org_id)')
    .gte('created_at', today.toISOString());

  if (tasksError) throw tasksError;

  const { data: interventions, error: intError } = await supabase
    .from('fd_interventions')
    .select('status')
    .eq('status', 'pending');

  if (intError) throw intError;

  const completed = tasks?.filter(t => t.status === 'completed').length || 0;
  const inProgress = tasks?.filter(t => t.status === 'active').length || 0;

  return {
    tasksToday: tasks?.length || 0,
    completed,
    inProgress,
    needsYou: interventions?.length || 0,
  };
}
