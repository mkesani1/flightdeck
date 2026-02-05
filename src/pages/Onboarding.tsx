import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  Lightbulb,
  Hammer,
  Rocket,
  TrendingUp,
  Zap,
  Code2,
  Mail,
  PenTool,
  BarChart3,
  Search,
  Palette,
  Loader2
} from 'lucide-react';
import Navigation from '../components/Navigation';
import { getAgents, getOrCreateDefaultOrg, createBusiness, assignAgentsToBusiness, addActivityFeedItem, type DbAgent } from '../lib/db';
import type { BusinessStage, AgentType } from '../types';

const stages: { id: BusinessStage; label: string; icon: React.ReactNode }[] = [
  { id: 'idea', label: 'Idea', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'plan', label: 'Plan', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'design', label: 'Design', icon: <Palette className="w-4 h-4" /> },
  { id: 'build', label: 'Build', icon: <Hammer className="w-4 h-4" /> },
  { id: 'test', label: 'Test', icon: <Code2 className="w-4 h-4" /> },
  { id: 'launch', label: 'Launch', icon: <Rocket className="w-4 h-4" /> },
  { id: 'grow', label: 'Grow', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'scale', label: 'Scale', icon: <Zap className="w-4 h-4" /> },
];

const integrations = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Track commits, PRs, and deployments',
    color: '#8B5CF6',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    )
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Monitor deployments and preview URLs',
    color: '#FFFFFF',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.525H0l12-21.05 12 21.05z"/>
      </svg>
    )
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Database metrics and edge functions',
    color: '#3ECF8E',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
      </svg>
    )
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notifications and agent updates',
    color: '#E01E5A',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.52 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.124a2.528 2.528 0 0 1 2.523 2.52A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    )
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Sync issues and project tracking',
    color: '#5E6AD2',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.018 11.143c0 .223.178.405.401.409l8.183.136a.406.406 0 0 0 .412-.412l-.136-8.183a.407.407 0 0 0-.409-.401 8.973 8.973 0 0 0-8.45 8.45zm-.327 1.69a8.977 8.977 0 0 0 8.476 8.476.406.406 0 0 0 .401-.409l-.12-7.209a.406.406 0 0 0-.397-.397l-7.95-.132a.407.407 0 0 0-.41.403v-.732zm9.166-10.142a8.976 8.976 0 0 1 9.452 9.452.406.406 0 0 1-.409.401l-8.183-.136a.406.406 0 0 1-.397-.397l-.136-8.183a.406.406 0 0 1 .401-.409l-.728.272z"/>
      </svg>
    )
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design system and asset library',
    color: '#F24E1E',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/>
      </svg>
    )
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment and revenue analytics',
    color: '#635BFF',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
      </svg>
    )
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'Email delivery and analytics',
    color: '#00D4FF',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.023 0L12 9.6 21.977 0H2.023zM0 2v20l8-8.889L0 2zm24 0l-8 11.111L24 22V2zM12 12.8L3.6 24h16.8L12 12.8z"/>
      </svg>
    )
  },
];

const agentConfig: Record<AgentType, { icon: React.ReactNode; description: string }> = {
  dev: { icon: <Code2 className="w-5 h-5" />, description: 'Builds features, fixes bugs, deploys code' },
  email: { icon: <Mail className="w-5 h-5" />, description: 'Drafts campaigns, sends sequences' },
  content: { icon: <PenTool className="w-5 h-5" />, description: 'Writes posts, docs, social content' },
  analytics: { icon: <BarChart3 className="w-5 h-5" />, description: 'Processes data, generates reports' },
  research: { icon: <Search className="w-5 h-5" />, description: 'Analyzes competitors, finds opportunities' },
  design: { icon: <Palette className="w-5 h-5" />, description: 'Creates assets, brand materials' },
};

const recommendedAgents: Record<BusinessStage, AgentType[]> = {
  idea: ['research', 'content'],
  plan: ['research', 'content'],
  design: ['design', 'dev'],
  build: ['dev', 'design'],
  test: ['dev', 'analytics'],
  launch: ['dev', 'content', 'email'],
  grow: ['email', 'content', 'analytics'],
  scale: ['analytics', 'email', 'content'],
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [stage, setStage] = useState<BusinessStage>('build');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  // Database state
  const [agents, setAgents] = useState<DbAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAgents() {
      try {
        const dbAgents = await getAgents();
        setAgents(dbAgents);
        const recommended = recommendedAgents['build'];
        const recommendedIds = dbAgents.filter(a => recommended.includes(a.type)).map(a => a.id);
        setSelectedAgents(recommendedIds);
      } catch (err) {
        console.error('Failed to load agents:', err);
        setError('Failed to load agents');
      } finally {
        setIsLoading(false);
      }
    }
    loadAgents();
  }, []);

  useEffect(() => {
    if (agents.length > 0) {
      const recommended = recommendedAgents[stage];
      const recommendedIds = agents.filter(a => recommended.includes(a.type)).map(a => a.id);
      setSelectedAgents(recommendedIds);
    }
  }, [stage, agents]);

  const canSubmit = name.trim().length > 0 && selectedAgents.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSaving(true);
    setError(null);

    try {
      const org = await getOrCreateDefaultOrg();

      const business = await createBusiness({
        orgId: org.id,
        name,
        tagline: tagline || undefined,
        stage,
        color: '#22C55E',
        githubConnected: connectedIntegrations.includes('github'),
        analyticsConnected: connectedIntegrations.includes('vercel'),
      });

      if (selectedAgents.length > 0) {
        await assignAgentsToBusiness(business.id, selectedAgents);
      }

      const devAgent = agents.find(a => a.type === 'dev');
      if (devAgent) {
        await addActivityFeedItem({
          businessId: business.id,
          agentId: devAgent.id,
          type: 'success',
          message: `${name} has been added to FlightDeck! Agents are now active.`,
        });
      }

      navigate('/live-ops');
    } catch (err) {
      console.error('Failed to create business:', err);
      setError('Failed to create business. Please try again.');
      setIsSaving(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const toggleIntegration = (integrationId: string) => {
    setConnectedIntegrations(prev =>
      prev.includes(integrationId) ? prev.filter(id => id !== integrationId) : [...prev, integrationId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Loader2 className="w-5 h-5 animate-spin text-[#636366]" />
          <span className="text-[15px] text-[#A1A1A6]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation variant="onboarding" currentPage="onboard" />

      {/* Main Content */}
      <main style={{ paddingTop: '64px' }}>
        <div style={{ padding: '48px 48px 40px 48px' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '48px' }}
          >
            <h1 className="text-[28px] font-bold mb-3 text-white tracking-tight">Add a new business</h1>
            <p className="text-[15px] text-[#8E8E93]">
              Set up your business and assign AI agents to start automating.
            </p>
          </motion.div>

          {/* Business Details Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '56px' }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]">
                Business Details
              </h2>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '24px' }}>
              <div
                className="bg-[#1A1A1C] rounded-2xl"
                style={{ padding: '32px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
              >
                <label className="block text-[11px] font-medium uppercase tracking-widest text-[#636366] mb-4">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., InvoiceFlow"
                  className="w-full px-5 py-4 bg-[#0D0D0D] rounded-xl text-[15px] text-white placeholder:text-[#48484A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                />

                <label className="block text-[11px] font-medium uppercase tracking-widest text-[#636366] mb-4 mt-8">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., Smart invoicing for founders"
                  className="w-full px-5 py-4 bg-[#0D0D0D] rounded-xl text-[15px] text-white placeholder:text-[#48484A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 transition-all"
                />
              </div>

              <div
                className="bg-[#1A1A1C] rounded-2xl"
                style={{ padding: '32px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
              >
                <label className="block text-[11px] font-medium uppercase tracking-widest text-[#636366] mb-4">
                  Current Stage
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {stages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStage(s.id)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        stage === s.id
                          ? 'bg-[#F59E0B] text-white'
                          : 'bg-[#0D0D0D] text-[#8E8E93] hover:bg-[#2A2A2E]'
                      }`}
                    >
                      <div className="flex justify-center mb-1.5">{s.icon}</div>
                      <p className="text-[11px] font-medium">{s.label}</p>
                    </button>
                  ))}
                </div>

                {/* Preview */}
                {name && (
                  <div className="flex items-center gap-5 mt-8 pt-8 border-t border-[#2A2A2E]">
                    <div className="w-14 h-14 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-bold text-[17px]">
                      {name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold text-white">{name}</p>
                      <p className="text-[13px] text-[#636366] mt-1">{stages.find(s => s.id === stage)?.label} stage</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Integrations Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '56px' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]">
                  Integrations
                </h2>
              </div>
              <span className="text-[12px] text-[#8B5CF6] font-medium">
                {connectedIntegrations.length} connected
              </span>
            </div>

            <div className="grid grid-cols-4" style={{ gap: '20px' }}>
              {integrations.map((integration) => {
                const isConnected = connectedIntegrations.includes(integration.id);
                return (
                  <button
                    key={integration.id}
                    onClick={() => toggleIntegration(integration.id)}
                    className="bg-[#1A1A1C] rounded-2xl text-left transition-all"
                    style={{
                      padding: '28px',
                      boxShadow: isConnected
                        ? `0 0 0 2px ${integration.color}, 0 4px 24px ${integration.color}20`
                        : '0 0 0 1px rgba(255,255,255,0.05)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: isConnected ? `${integration.color}20` : '#2A2A2E',
                          color: isConnected ? integration.color : '#8E8E93'
                        }}
                      >
                        {integration.icon}
                      </div>
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center transition-colors"
                        style={{ backgroundColor: isConnected ? integration.color : '#2A2A2E' }}
                      >
                        {isConnected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <p className="text-[15px] font-semibold text-white mb-2">{integration.name}</p>
                    <p className="text-[13px] text-[#636366] leading-relaxed">{integration.description}</p>
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* AI Agents Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '56px' }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#22C55E]" />
                </div>
                <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]">
                  AI Agents
                </h2>
              </div>
              <span className="text-[12px] text-[#22C55E] font-medium">
                {selectedAgents.length} assigned
              </span>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '20px' }}>
              {agents.map((agent, index) => {
                const isRecommended = recommendedAgents[stage].includes(agent.type);
                const isSelected = selectedAgents.includes(agent.id);
                const config = agentConfig[agent.type];

                return (
                  <motion.button
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => toggleAgent(agent.id)}
                    className={`bg-[#1A1A1C] rounded-2xl text-left relative overflow-hidden transition-all ${
                      isSelected ? 'ring-2 ring-[#22C55E]' : ''
                    }`}
                    style={{ padding: '32px', boxShadow: isSelected ? undefined : '0 0 0 1px rgba(255,255,255,0.05)' }}
                  >
                    {/* Green left border for selected */}
                    {isSelected && (
                      <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#22C55E] rounded-r-full" />
                    )}

                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#2A2A2E] text-[#8E8E93]'
                      }`}>
                        {config.icon}
                      </div>
                      <div className="flex items-center gap-3">
                        {isRecommended && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#22C55E]">
                            Recommended
                          </span>
                        )}
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-[#22C55E]' : 'bg-[#2A2A2E]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>

                    <p className="text-[16px] font-semibold text-white mb-2">{agent.name}</p>
                    <p className="text-[14px] text-[#9A9A9E] leading-[1.6]" style={{ minHeight: '48px' }}>
                      {config.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          {/* Error display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 bg-[#FF4405]/10 rounded-2xl"
              style={{ boxShadow: '0 0 0 1px rgba(255, 68, 5, 0.3)' }}
            >
              <p className="text-[14px] text-[#FF4405]">{error}</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Sticky Footer with Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#1C1C1E]" style={{ padding: '20px 48px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {name && (
              <>
                <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-white font-bold text-[13px]">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">{name}</p>
                  <p className="text-[12px] text-[#636366]">{selectedAgents.length} agents · {connectedIntegrations.length} integrations</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSaving}
            className={`flex items-center gap-3 py-4 px-8 rounded-xl text-[15px] font-semibold transition-all ${
              canSubmit && !isSaving
                ? 'bg-[#22C55E] text-white hover:bg-[#1EA34D]'
                : 'bg-[#2A2A2E] text-[#636366] cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Create Business
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom padding for sticky footer */}
      <div style={{ height: '100px' }} />
    </div>
  );
}
