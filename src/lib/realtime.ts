import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Types for real-time data
export interface Task {
  id: string;
  business_id: string | null;
  agent_id: string | null;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  module: string | null;
  source_type: string | null;
  source_id: string | null;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  output_channel: string | null;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  created_at: string;
  completed_at: string | null;
  processing_started_at: string | null;
  error_message: string | null;
  // Joined data
  agent?: Agent;
  business?: Business;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  emoji: string | null;
  is_global: boolean;
}

export interface Business {
  id: string;
  org_id: string;
  name: string;
  color: string;
  avatar_initials: string | null;
}

export interface Intervention {
  id: string;
  business_id: string | null;
  agent_id: string | null;
  type: 'approval' | 'decision' | 'review' | 'clarification' | 'error';
  title: string;
  context: string | null;
  options: { label: string; value: string }[] | null;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  resolved_at: string | null;
  agent?: Agent;
  business?: Business;
}

export interface ActivityItem {
  id: string;
  business_id: string | null;
  agent_id: string | null;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  agent?: Agent;
  business?: Business;
}

// Hook for real-time tasks
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchAndSubscribe() {
      try {
        // Initial fetch
        const { data, error: fetchError } = await supabase
          .from('tasks')
          .select(`
            *,
            agent:agents(*),
            business:businesses(*)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;
        setTasks(data || []);
        setLoading(false);

        // Subscribe to changes
        channel = supabase
          .channel('tasks-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks' },
            async (payload) => {
              if (payload.eventType === 'INSERT') {
                // Fetch the full task with joins
                const { data: newTask } = await supabase
                  .from('tasks')
                  .select(`*, agent:agents(*), business:businesses(*)`)
                  .eq('id', payload.new.id)
                  .single();

                if (newTask) {
                  setTasks(prev => [newTask, ...prev]);
                }
              } else if (payload.eventType === 'UPDATE') {
                const { data: updatedTask } = await supabase
                  .from('tasks')
                  .select(`*, agent:agents(*), business:businesses(*)`)
                  .eq('id', payload.new.id)
                  .single();

                if (updatedTask) {
                  setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                }
              } else if (payload.eventType === 'DELETE') {
                setTasks(prev => prev.filter(t => t.id !== payload.old.id));
              }
            }
          )
          .subscribe();
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchAndSubscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { tasks, loading, error };
}

// Hook for real-time interventions
export function useInterventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const resolveIntervention = useCallback(async (id: string, resolution: string) => {
    const { error: updateError } = await supabase
      .from('interventions')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;
  }, []);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchAndSubscribe() {
      try {
        const { data, error: fetchError } = await supabase
          .from('interventions')
          .select(`
            *,
            agent:agents(*),
            business:businesses(*)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setInterventions(data || []);
        setLoading(false);

        channel = supabase
          .channel('interventions-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'interventions' },
            async (payload) => {
              if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
                const { data: newInt } = await supabase
                  .from('interventions')
                  .select(`*, agent:agents(*), business:businesses(*)`)
                  .eq('id', payload.new.id)
                  .single();

                if (newInt) {
                  setInterventions(prev => [newInt, ...prev]);
                }
              } else if (payload.eventType === 'UPDATE') {
                if (payload.new.status !== 'pending') {
                  setInterventions(prev => prev.filter(i => i.id !== payload.new.id));
                } else {
                  const { data: updatedInt } = await supabase
                    .from('interventions')
                    .select(`*, agent:agents(*), business:businesses(*)`)
                    .eq('id', payload.new.id)
                    .single();

                  if (updatedInt) {
                    setInterventions(prev => prev.map(i => i.id === updatedInt.id ? updatedInt : i));
                  }
                }
              } else if (payload.eventType === 'DELETE') {
                setInterventions(prev => prev.filter(i => i.id !== payload.old.id));
              }
            }
          )
          .subscribe();
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchAndSubscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { interventions, loading, error, resolveIntervention };
}

// Hook for real-time activity feed
export function useActivityFeed(limit = 10) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function fetchAndSubscribe() {
      try {
        const { data, error: fetchError } = await supabase
          .from('activity_feed')
          .select(`
            *,
            agent:agents(*),
            business:businesses(*)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;
        setActivities(data || []);
        setLoading(false);

        channel = supabase
          .channel('activity-changes')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'activity_feed' },
            async (payload) => {
              const { data: newActivity } = await supabase
                .from('activity_feed')
                .select(`*, agent:agents(*), business:businesses(*)`)
                .eq('id', payload.new.id)
                .single();

              if (newActivity) {
                setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)]);
              }
            }
          )
          .subscribe();
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchAndSubscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [limit]);

  return { activities, loading, error };
}

// Hook for live stats
export function useLiveStats() {
  const [stats, setStats] = useState({
    tasksToday: 0,
    completed: 0,
    inProgress: 0,
    needsYou: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [tasksResult, interventionsResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('status')
        .gte('created_at', today.toISOString()),
      supabase
        .from('interventions')
        .select('id')
        .eq('status', 'pending'),
    ]);

    const tasks = tasksResult.data || [];
    const interventions = interventionsResult.data || [];

    setStats({
      tasksToday: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      needsYou: interventions.length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Also subscribe to changes for immediate updates
    const channel = supabase
      .channel('stats-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, fetchStats)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return { stats, loading };
}

// Hook for agents
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('name');

      if (!error && data) {
        setAgents(data);
      }
      setLoading(false);
    }

    fetchAgents();
  }, []);

  return { agents, loading };
}

// Function to create a task (can be called from anywhere)
export async function createTask(task: {
  title: string;
  description?: string;
  module?: string;
  agent_type?: string;
  source_type?: 'cowork' | 'slack' | 'email' | 'api' | 'manual';
  source_id?: string;
  input_data?: Record<string, unknown>;
  output_channel?: 'slack' | 'email' | 'webhook' | 'dashboard';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  callback_url?: string;
}) {
  // Find agent by type if specified
  let agentId: string | null = null;
  if (task.agent_type) {
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('type', task.agent_type)
      .single();

    if (agent) {
      agentId = agent.id;
    }
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description || null,
      module: task.module || null,
      agent_id: agentId,
      source_type: task.source_type || 'manual',
      source_id: task.source_id || null,
      input_data: task.input_data || null,
      output_channel: task.output_channel || 'dashboard',
      priority: task.priority || 'normal',
      callback_url: task.callback_url || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
