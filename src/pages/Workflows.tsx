import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Circle, PlayCircle, MessageSquare, Bell, Zap, Lightbulb, Clipboard, Palette, Code, TestTubes, Rocket, TrendingUp, Gauge } from 'lucide-react';
import Navigation from '../components/Navigation';
import { mockBusinesses, startupWorkflows } from '../lib/mockData';

// Stage colors and order - Monochrome grayscale progression
const stageConfig: Record<string, { color: string; grayLevel: string; order: number; description: string; icon: React.ReactNode }> = {
  idea: { color: '#8E8E93', grayLevel: '#5A5A5E', order: 1, description: 'Validate the concept', icon: <Lightbulb className="w-4 h-4" /> },
  plan: { color: '#A1A1A6', grayLevel: '#6A6A6E', order: 2, description: 'Define MVP scope', icon: <Clipboard className="w-4 h-4" /> },
  design: { color: '#B5B5BA', grayLevel: '#7A7A7E', order: 3, description: 'Create visual identity', icon: <Palette className="w-4 h-4" /> },
  build: { color: '#C9C9CE', grayLevel: '#8A8A8E', order: 4, description: 'Develop the MVP', icon: <Code className="w-4 h-4" /> },
  test: { color: '#DDDDDE', grayLevel: '#9A9A9E', order: 5, description: 'QA and user testing', icon: <TestTubes className="w-4 h-4" /> },
  launch: { color: '#FF4405', grayLevel: '#CC3603', order: 6, description: 'Go live', icon: <Rocket className="w-4 h-4" /> },
  grow: { color: '#E5E5EA', grayLevel: '#ADADB0', order: 7, description: 'Acquire customers', icon: <TrendingUp className="w-4 h-4" /> },
  scale: { color: '#F5F5F7', grayLevel: '#BDBDC2', order: 8, description: 'Optimize & expand', icon: <Gauge className="w-4 h-4" /> },
};

// Onboarding Flow Visualization
function OnboardingFlow() {
  const steps = [
    { id: 1, label: 'Add Startup', description: 'Name, tagline, stage', icon: <Circle className="w-5 h-5" />, color: '#8E8E93' },
    { id: 2, label: 'Select Stage', description: 'idea → scale', icon: <Gauge className="w-5 h-5" />, color: '#A1A1A6' },
    { id: 3, label: 'Auto-assign Agents', description: 'Based on stage', icon: <Zap className="w-5 h-5" />, color: '#22C55E' },
    { id: 4, label: 'Connect Integrations', description: 'Slack, Stripe, GitHub', icon: <Code className="w-5 h-5" />, color: '#8B5CF6' },
    { id: 5, label: 'Set Preferences', description: 'Notifications, thresholds', icon: <Bell className="w-5 h-5" />, color: '#F59E0B' },
    { id: 6, label: 'Agents Activate', description: 'Work begins', icon: <CheckCircle className="w-5 h-5" />, color: '#22C55E' },
  ];

  return (
    <div className="bg-[#1A1A1C] rounded-2xl" style={{ padding: '32px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}>
      <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]" style={{ marginBottom: '28px' }}>Startup Onboarding Flow</h3>
      <div className="grid grid-cols-6" style={{ gap: '12px' }}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                {step.icon}
              </div>
              <span className="text-[13px] font-semibold text-white text-center">{step.label}</span>
              <span className="text-[11px] text-[#636366] text-center mt-1.5">{step.description}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-[#48484A] ml-2 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Intervention Trigger Flow
function InterventionFlow() {
  const triggers = [
    { type: 'approval', label: 'Need Approval', color: '#FF4405', examples: ['Pricing change', 'Deploy to prod', 'Budget increase'], needsAttention: true },
    { type: 'decision', label: 'Need Decision', color: '#C9C9CE', examples: ['A/B test results', 'Feature priority', 'Channel focus'], needsAttention: false },
    { type: 'review', label: 'Need Review', color: '#A1A1A6', examples: ['Document ready', 'Code review', 'Design approval'], needsAttention: false },
    { type: 'clarification', label: 'Need Info', color: '#8E8E93', examples: ['Missing context', 'API keys needed', 'Brand guidelines'], needsAttention: false },
    { type: 'error', label: 'Error Recovery', color: '#FF4405', examples: ['API failure', 'Build error', 'Integration down'], needsAttention: true },
  ];

  return (
    <div className="bg-[#1A1A1C] rounded-2xl transition-all duration-300 hover:bg-[#1E1E20]" style={{ padding: '32px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}>
      <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]" style={{ marginBottom: '8px' }}>Intervention Triggers</h3>
      <p className="text-[14px] text-[#636366]" style={{ marginBottom: '28px' }}>When agents need your input, they create interventions sent via Slack</p>

      <div className="grid grid-cols-5" style={{ gap: '16px' }}>
        {triggers.map((trigger, index) => (
          <motion.div
            key={trigger.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0D0D0D] rounded-2xl transition-all duration-300 hover:bg-[#151517]"
            style={{ padding: '20px' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: trigger.color, marginBottom: '16px' }}
            />
            <span className="text-[14px] font-semibold text-white block" style={{ marginBottom: '12px' }}>{trigger.label}</span>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {trigger.examples.map((ex, i) => (
                <li key={i} className="text-[12px] text-[#636366]">• {ex}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center bg-[#0D0D0D] rounded-2xl transition-all duration-300 hover:bg-[#151517]" style={{ marginTop: '24px', padding: '20px 24px', gap: '20px' }}>
        <Bell className="w-5 h-5 text-[#22C55E]" />
        <div className="flex-1">
          <span className="text-[14px] text-white font-medium block" style={{ marginBottom: '4px' }}>Slack Notification Flow</span>
          <span className="text-[12px] text-[#636366] block leading-relaxed">Agent blocked → FlightDeck creates intervention → Slack DM with action buttons → Founder responds → Agent continues</span>
        </div>
        <MessageSquare className="w-5 h-5 text-[#48484A]" />
      </div>
    </div>
  );
}

// Startup Card with Workflow
function StartupWorkflowCard({ business }: { business: typeof mockBusinesses[0] }) {
  const workflow = startupWorkflows[business.id];
  const stage = stageConfig[business.stage] || stageConfig.build;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1C] rounded-2xl transition-all duration-300 hover:bg-[#1E1E20]"
      style={{ padding: '28px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center" style={{ gap: '14px', marginBottom: '24px' }}>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[12px] font-bold text-white"
          style={{ backgroundColor: business.color }}
        >
          {business.avatar_initials}
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-semibold text-white">{business.name}</h4>
          <p className="text-[12px] text-[#636366]" style={{ marginTop: '2px' }}>{business.tagline}</p>
        </div>
        <div
          className="rounded-lg text-[10px] font-semibold uppercase flex items-center"
          style={{
            padding: '6px 10px',
            gap: '6px',
            backgroundColor: stage.order === 6 ? 'rgba(255,68,5,0.12)' : 'rgba(201,201,206,0.12)'
          }}
        >
          {stage.icon}
          <span style={{ color: stage.order === 6 ? '#FF4405' : '#A1A1A6' }}>{business.stage}</span>
        </div>
      </div>

      {workflow && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {workflow.tasks.map((task, index) => (
            <div key={index} className="flex items-start" style={{ gap: '12px', padding: '10px 0' }}>
              {task.status === 'completed' ? (
                <CheckCircle className="w-[18px] h-[18px] text-[#22C55E] mt-0.5 shrink-0" />
              ) : task.status === 'active' ? (
                <PlayCircle className="w-[18px] h-[18px] text-[#22C55E] mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-[18px] h-[18px] text-[#48484A] mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[12px] text-[#636366] block">{task.agent}</span>
                <span className={`text-[14px] leading-snug ${task.status === 'completed' ? 'text-[#636366]' : 'text-white'}`} style={{ marginTop: '2px', display: 'block' }}>
                  {task.task}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Stage Pipeline View
function StagePipeline() {
  const stages = Object.entries(stageConfig).sort((a, b) => a[1].order - b[1].order);
  const businessesByStage = stages.map(([stage]) => ({
    stage,
    businesses: mockBusinesses.filter(b => b.stage === stage),
  }));

  return (
    <div className="bg-[#1A1A1C] rounded-2xl transition-all duration-300 hover:bg-[#1E1E20]" style={{ padding: '32px', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}>
      <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]" style={{ marginBottom: '28px' }}>Startup Pipeline by Stage</h3>
      <div className="flex overflow-x-auto pb-2" style={{ gap: '20px' }}>
        {businessesByStage.map(({ stage, businesses }) => {
          const config = stageConfig[stage];
          const isAttention = config.order === 6;
          return (
            <div key={stage} className="min-w-[160px]">
              <div className="flex items-center" style={{ gap: '10px', marginBottom: '16px' }}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isAttention ? '#FF4405' : config.color }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center" style={{ gap: '6px', color: isAttention ? '#FF4405' : config.color }}>
                  {config.icon}
                  {stage}
                </span>
                <span className="text-[11px] text-[#48484A]">({businesses.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {businesses.map(biz => (
                  <div
                    key={biz.id}
                    className="bg-[#0D0D0D] rounded-xl transition-all duration-300 hover:bg-[#151517]"
                    style={{ padding: '14px 16px' }}
                  >
                    <div className="flex items-center" style={{ gap: '10px' }}>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: biz.color }}
                      >
                        {biz.avatar_initials}
                      </div>
                      <span className="text-[13px] text-white font-medium">{biz.name}</span>
                    </div>
                  </div>
                ))}
                {businesses.length === 0 && (
                  <div className="bg-[#0D0D0D] rounded-xl border border-dashed border-[#2A2A2E] transition-all duration-300 hover:bg-[#151517]" style={{ padding: '14px 16px' }}>
                    <span className="text-[12px] text-[#48484A]">No startups</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Workflows Page
export default function Workflows() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filteredBusinesses = selectedStage
    ? mockBusinesses.filter(b => b.stage === selectedStage)
    : mockBusinesses;

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white">
      <Navigation variant="workflows" currentPage="workflows" />

      <main style={{ marginTop: '64px', padding: '40px 48px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 className="text-2xl font-bold text-white" style={{ marginBottom: '8px' }}>Startup Workflows</h1>
          <p className="text-[14px] text-[#636366]">
            How FlightDeck onboards, monitors, and triggers interventions for your {mockBusinesses.length} startups
          </p>
        </div>

        {/* Onboarding Flow */}
        <div style={{ marginBottom: '24px' }}>
          <OnboardingFlow />
        </div>

        {/* Stage Pipeline */}
        <div style={{ marginBottom: '24px' }}>
          <StagePipeline />
        </div>

        {/* Intervention Triggers */}
        <div style={{ marginBottom: '56px' }}>
          <InterventionFlow />
        </div>

        {/* Startup Workflows Grid */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[#636366]">
              Active Workflows by Startup
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedStage(null)}
                className={`rounded-lg text-[12px] font-medium transition-colors ${
                  !selectedStage ? 'bg-white text-[#0D0D0D]' : 'bg-[#1A1A1C] text-[#8E8E93] hover:bg-[#222224]'
                }`}
                style={{ padding: '8px 14px', boxShadow: selectedStage ? '0 0 0 1px rgba(255,255,255,0.05)' : 'none' }}
              >
                All
              </button>
              {['build', 'launch', 'grow'].map(stage => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`rounded-lg text-[12px] font-medium transition-colors ${
                    selectedStage === stage ? 'bg-white text-[#0D0D0D]' : 'bg-[#1A1A1C] text-[#8E8E93] hover:bg-[#222224]'
                  }`}
                  style={{ padding: '8px 14px', boxShadow: selectedStage !== stage ? '0 0 0 1px rgba(255,255,255,0.05)' : 'none' }}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3" style={{ gap: '20px' }}>
            <AnimatePresence mode="popLayout">
              {filteredBusinesses.map(business => (
                <StartupWorkflowCard key={business.id} business={business} />
              ))}
            </AnimatePresence>
            {filteredBusinesses.length === 0 && (
              <div className="col-span-3 text-center" style={{ padding: '48px 0' }}>
                <p className="text-[14px] text-[#636366]">No workflows found for this stage</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
