import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, AlertCircle, Zap, FileText, Target, CreditCard } from 'lucide-react';
import Navigation from '../components/Navigation';
import { mockActiveAgents, mockInterventions, mockActivityFeed, mockLiveStats, generateRandomActivity } from '../lib/mockData';
import type { ActivityFeedItem, Intervention, ActiveAgent, LiveStats } from '../types';

// Utility to format time ago
function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  return `${Math.floor(hours / 24)} days`;
}

// Typing indicator component
function TypingDots() {
  return (
    <span className="inline-flex gap-1 ml-2">
      <span className="typing-dot w-1.5 h-1.5 bg-white/40 rounded-full" />
      <span className="typing-dot w-1.5 h-1.5 bg-white/40 rounded-full" />
      <span className="typing-dot w-1.5 h-1.5 bg-white/40 rounded-full" />
    </span>
  );
}

// Stats Bar component - LOCKED DESIGN (2026-02-03)
function StatsBar({ stats }: { stats: LiveStats }) {
  return (
    <div className="grid grid-cols-4 bg-[#1A1A1C] rounded-2xl overflow-hidden ring-1 ring-white/[0.05]" style={{ marginBottom: '48px' }}>
      <div className="py-8 px-6 text-center relative">
        <p className="text-4xl font-bold text-white mb-2 tracking-tight">{stats.tasksToday}</p>
        <p className="text-[11px] text-[#636366] uppercase tracking-widest">Tasks Today</p>
        <div className="absolute right-0 top-5 bottom-5 w-px bg-[#2A2A2E]" />
      </div>
      <div className="py-8 px-6 text-center relative">
        <p className="text-4xl font-bold text-[#22C55E] mb-2 tracking-tight">{stats.completed}</p>
        <p className="text-[11px] text-[#636366] uppercase tracking-widest">Completed</p>
        <div className="absolute right-0 top-5 bottom-5 w-px bg-[#2A2A2E]" />
      </div>
      <div className="py-8 px-6 text-center relative">
        <p className="text-4xl font-bold text-white mb-2 tracking-tight">{stats.inProgress}</p>
        <p className="text-[11px] text-[#636366] uppercase tracking-widest">In Progress</p>
        <div className="absolute right-0 top-5 bottom-5 w-px bg-[#2A2A2E]" />
      </div>
      <div className="py-8 px-6 text-center">
        <p className="text-4xl font-bold text-[#FF4405] mb-2 tracking-tight">{stats.needsYou}</p>
        <p className="text-[11px] text-[#636366] uppercase tracking-widest">Need You</p>
      </div>
    </div>
  );
}

// Agent Card component - LOCKED DESIGN (2026-02-03)
function AgentCard({ activeAgent, index }: { activeAgent: ActiveAgent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1A1A1C] rounded-2xl relative overflow-hidden p-6"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      {/* Green LEFT border for active agents - 4px width per design spec */}
      {activeAgent.isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--color-green)] rounded-r-full" />
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-[#2A2A2E] rounded-xl flex items-center justify-center text-xl">
            {activeAgent.agent.emoji}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-white">{activeAgent.agent.name}</span>
            <span className={`w-2 h-2 rounded-full ${activeAgent.isActive ? 'bg-[#22C55E]' : 'bg-[#48484A]'}`} />
          </div>
        </div>
        {/* Menu dots */}
        <button className="text-[#48484A] hover:text-white transition-colors p-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>

      <p className="text-[14px] text-[#9A9A9E] mb-6 leading-[1.65]" style={{ minHeight: '48px' }}>
        {activeAgent.currentTask}
        {activeAgent.isActive && <TypingDots />}
      </p>

      {activeAgent.business && (
        <p className="text-[12px] text-[#636366]">
          {activeAgent.business.name}
        </p>
      )}
    </motion.div>
  );
}

// Activity Feed Item component - LOCKED DESIGN (2026-02-03)
function FeedItem({ item, index }: { item: ActivityFeedItem; index: number }) {
  const typeConfig = {
    success: { icon: <Check className="w-4 h-4" />, bg: 'bg-[#22C55E]/10', color: 'text-[#22C55E]' },
    info: { icon: <Zap className="w-4 h-4" />, bg: 'bg-[#2A2A2E]', color: 'text-[#8E8E93]' },
    warning: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-[#F59E0B]/10', color: 'text-[#F59E0B]' },
    error: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-[#FF4405]/10', color: 'text-[#FF4405]' },
  };

  const config = typeConfig[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 bg-[#1A1A1C] rounded-2xl p-5"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[14px] text-[#A1A1A6] leading-[1.55]">
          <strong className="text-white font-semibold">{item.agent?.name}</strong>{' '}
          {item.message.replace(item.agent?.name || '', '').replace(/^(Dev Agent|Email Agent|Content Agent|Analytics Agent|Research Agent|Design Agent)\s*/, '')}
        </p>
        <div className="flex items-center gap-3 mt-2.5 text-[12px] text-[#636366]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48484A]" />
            {item.business?.name}
          </span>
          <span>{timeAgo(item.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Intervention Card component
function InterventionCard({ intervention, onResolve }: { intervention: Intervention; onResolve: (id: string) => void }) {
  const typeConfig = {
    approval: {
      icon: <CreditCard className="w-5 h-5" />,
      label: 'APPROVAL REQUIRED',
      primaryBtn: 'Approve Change',
      secondaryBtn: 'Review Details'
    },
    decision: {
      icon: <Target className="w-5 h-5" />,
      label: 'DECISION NEEDED',
      primaryBtn: 'Yes, Focus LinkedIn',
      secondaryBtn: 'Keep Both'
    },
    review: {
      icon: <FileText className="w-5 h-5" />,
      label: 'REVIEW REQUIRED',
      primaryBtn: 'Review Document',
      secondaryBtn: 'Later'
    },
    clarification: {
      icon: <AlertCircle className="w-5 h-5" />,
      label: 'CLARIFICATION NEEDED',
      primaryBtn: 'Respond',
      secondaryBtn: 'Later'
    },
    error: {
      icon: <AlertCircle className="w-5 h-5" />,
      label: 'ERROR RECOVERY',
      primaryBtn: 'Fix Issue',
      secondaryBtn: 'Ignore'
    },
  };

  const config = typeConfig[intervention.type];
  const isUrgent = intervention.type === 'approval';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1A1A1C] rounded-2xl p-6"
      style={{
        boxShadow: isUrgent
          ? '0 0 0 2px rgba(255, 68, 5, 0.7), 0 4px 24px rgba(255, 68, 5, 0.15)'
          : '0 0 0 1px rgba(255,255,255,0.05)'
      }}
    >
      {/* Type Label */}
      <div className="flex items-center gap-3.5 mb-7">
        <div className="w-9 h-9 rounded-xl bg-[#2A2A2E] flex items-center justify-center text-[#8E8E93]">
          {config.icon}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#636366]">
          {config.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-semibold text-white mb-4">
        {intervention.title}
      </h3>

      {/* Context */}
      <p className="text-[14px] text-[#A1A1A6] leading-[1.7] mb-7">
        {intervention.context}
      </p>

      {/* Business Badge */}
      {intervention.business && (
        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#0D0D0D] rounded-xl mb-7">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: intervention.business.color }}
          >
            {intervention.business.avatar_initials}
          </div>
          <span className="text-[13px] font-medium text-white">
            {intervention.business.name}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3.5 mb-6">
        <button
          onClick={() => onResolve(intervention.id)}
          className="flex-1 py-3.5 px-5 bg-white text-[#0D0D0D] rounded-xl text-[14px] font-semibold hover:bg-white/90 transition-colors"
        >
          {config.primaryBtn}
        </button>
        <button className="flex-1 py-3.5 px-5 bg-[#2A2A2E] text-white rounded-xl text-[14px] font-semibold hover:bg-[#3A3A3E] transition-colors">
          {config.secondaryBtn}
        </button>
      </div>

      {/* Footer */}
      <p className="text-[12px] text-[#636366] flex items-center gap-2">
        <Clock className="w-3.5 h-3.5" />
        Waiting for {timeAgo(intervention.created_at)} · Sent to Slack
      </p>
    </motion.div>
  );
}

// Main LiveOps Page
export default function LiveOps() {
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(mockActivityFeed.slice(0, 5));
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [stats] = useState<LiveStats>(mockLiveStats);

  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      setActivityFeed(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleResolveIntervention = (id: string) => {
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  const activeAgentCount = mockActiveAgents.filter(a => a.isActive).length;

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white">
      <Navigation variant="live-ops" agentCount={activeAgentCount} currentPage="live-ops" />

      <main className="flex" style={{ marginTop: '64px' }}>
        {/* Left Panel - Main Content */}
        <section className="flex-1 border-r border-white/[0.04] overflow-y-auto max-h-[calc(100vh-64px)]" style={{ padding: '40px 48px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 className="text-2xl font-bold mb-2 text-white">Live Operations</h1>
            <p className="text-[14px] text-[#636366]">
              Watching {activeAgentCount} agents work across {new Set(mockActiveAgents.map(a => a.business?.id)).size} businesses
            </p>
          </div>

          {/* Stats */}
          <StatsBar stats={stats} />

          {/* Active Agents Grid */}
          <div style={{ marginBottom: '56px' }}>
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]" style={{ marginBottom: '24px' }}>
              Active Agents
            </h2>
            <div className="grid grid-cols-3" style={{ gap: '20px' }}>
              {mockActiveAgents.map((activeAgent, index) => (
                <AgentCard key={activeAgent.agent.id} activeAgent={activeAgent} index={index} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]">
                Activity Feed
              </h2>
              <button className="text-[12px] text-[#8E8E93] px-4 py-2 bg-[#1A1A1C] rounded-lg hover:bg-[#222224] transition-colors" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}>
                All activity ▾
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AnimatePresence mode="popLayout">
                {activityFeed.map((item, index) => (
                  <FeedItem key={item.id} item={item} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right Panel - Interventions */}
        <section className="w-[460px] overflow-y-auto max-h-[calc(100vh-64px)] bg-[#0A0A0C]" style={{ padding: '40px 36px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '40px' }}>
            <h2 className="text-lg font-semibold text-white">Needs Your Input</h2>
            <div className="w-8 h-8 bg-[#FF4405] rounded-full flex items-center justify-center text-[13px] font-bold text-white">
              {interventions.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AnimatePresence mode="popLayout">
              {interventions.map(intervention => (
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  onResolve={handleResolveIntervention}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
