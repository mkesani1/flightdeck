import type { Agent, Business, ActiveAgent, Intervention, ActivityFeedItem, LiveStats } from '../types';

// Mock Agents
export const mockAgents: Agent[] = [
  { id: '1', name: 'Dev Agent', type: 'dev', emoji: '🤖', is_global: true },
  { id: '2', name: 'Email Agent', type: 'email', emoji: '📧', is_global: true },
  { id: '3', name: 'Content Agent', type: 'content', emoji: '📝', is_global: true },
  { id: '4', name: 'Analytics Agent', type: 'analytics', emoji: '📊', is_global: true },
  { id: '5', name: 'Research Agent', type: 'research', emoji: '🔍', is_global: true },
  { id: '6', name: 'Design Agent', type: 'design', emoji: '🎨', is_global: true },
];

// Mock Businesses - 11 AI Startups across different stages
export const mockBusinesses: Business[] = [
  { id: '11', org_id: '1', name: 'CME Copilot', tagline: 'AI-powered medical education', stage: 'build', color: '#0EA5E9', avatar_initials: 'CM', created_at: new Date().toISOString() },
  { id: '1', org_id: '1', name: 'Co-elevator', tagline: 'AI-powered pitch decks', stage: 'launch', color: '#FF4405', avatar_initials: 'CE', created_at: new Date().toISOString() },
  { id: '2', org_id: '1', name: 'Parama.ai', tagline: 'Parameter tuning assistant', stage: 'grow', color: '#3B82F6', avatar_initials: 'PA', created_at: new Date().toISOString() },
  { id: '3', org_id: '1', name: 'IndiVillage', tagline: 'Marketplace for rural artisans', stage: 'launch', color: '#22C55E', avatar_initials: 'IV', created_at: new Date().toISOString() },
  { id: '4', org_id: '1', name: 'Karma Street Wear', tagline: 'Ethical streetwear brand', stage: 'build', color: '#F59E0B', avatar_initials: 'KS', created_at: new Date().toISOString() },
  { id: '5', org_id: '1', name: 'SlideArabi', tagline: 'Arabic presentation builder', stage: 'launch', color: '#8B5CF6', avatar_initials: 'SA', created_at: new Date().toISOString() },
  { id: '6', org_id: '1', name: 'StockClerk.ai', tagline: 'Inventory management AI', stage: 'build', color: '#EC4899', avatar_initials: 'SC', created_at: new Date().toISOString() },
  { id: '7', org_id: '1', name: 'LeadPulse', tagline: 'Real-time lead scoring', stage: 'idea', color: '#14B8A6', avatar_initials: 'LP', created_at: new Date().toISOString() },
  { id: '8', org_id: '1', name: 'InvoiceFlow', tagline: 'Smart invoicing platform', stage: 'grow', color: '#F97316', avatar_initials: 'IF', created_at: new Date().toISOString() },
  { id: '9', org_id: '1', name: 'DataNest', tagline: 'Data warehouse for startups', stage: 'scale', color: '#06B6D4', avatar_initials: 'DN', created_at: new Date().toISOString() },
  { id: '10', org_id: '1', name: 'MealMind', tagline: 'AI meal planning for families', stage: 'plan', color: '#84CC16', avatar_initials: 'MM', created_at: new Date().toISOString() },
];

// Startup workflows by stage - defines what tasks agents perform
export const startupWorkflows: Record<string, { stage: string; tasks: { agent: string; task: string; status: 'pending' | 'active' | 'completed' }[] }> = {
  // BUILD Stage - CME Copilot (actively working on this!)
  '11': {
    stage: 'build',
    tasks: [
      { agent: 'Design Agent', task: 'Lock FlightDeck dashboard design specs', status: 'completed' },
      { agent: 'Dev Agent', task: 'Build Workflows page with premium spacing', status: 'completed' },
      { agent: 'Research Agent', task: 'Research Claude Slack connector capabilities', status: 'completed' },
      { agent: 'Dev Agent', task: 'Update dashboard to reflect CME Copilot status', status: 'active' },
      { agent: 'Dev Agent', task: 'Build onboarding flow UI', status: 'pending' },
      { agent: 'Dev Agent', task: 'Implement Supabase integration', status: 'pending' },
    ]
  },
  // IDEA Stage - LeadPulse
  '7': {
    stage: 'idea',
    tasks: [
      { agent: 'Research Agent', task: 'Analyze lead scoring market size (TAM/SAM/SOM)', status: 'completed' },
      { agent: 'Research Agent', task: 'Identify top 10 competitors and their pricing', status: 'active' },
      { agent: 'Research Agent', task: 'Survey potential users on pain points', status: 'pending' },
    ]
  },
  // PLAN Stage - MealMind
  '10': {
    stage: 'plan',
    tasks: [
      { agent: 'Research Agent', task: 'User persona research for busy parents', status: 'completed' },
      { agent: 'Research Agent', task: 'Feature prioritization matrix', status: 'active' },
      { agent: 'Content Agent', task: 'Write Product Requirements Document', status: 'pending' },
      { agent: 'Content Agent', task: 'Create user stories for MVP', status: 'pending' },
    ]
  },
  // BUILD Stage - Karma Street Wear
  '4': {
    stage: 'build',
    tasks: [
      { agent: 'Design Agent', task: 'Generate brand assets and logo variations', status: 'active' },
      { agent: 'Dev Agent', task: 'Build Shopify storefront integration', status: 'pending' },
      { agent: 'Dev Agent', task: 'Implement product catalog API', status: 'pending' },
      { agent: 'Content Agent', task: 'Write product descriptions', status: 'pending' },
    ]
  },
  // BUILD Stage - StockClerk.ai
  '6': {
    stage: 'build',
    tasks: [
      { agent: 'Dev Agent', task: 'Build inventory tracking dashboard', status: 'completed' },
      { agent: 'Dev Agent', task: 'Implement barcode scanning API', status: 'active' },
      { agent: 'Design Agent', task: 'Design mobile app wireframes', status: 'active' },
      { agent: 'Analytics Agent', task: 'Set up usage analytics pipeline', status: 'pending' },
    ]
  },
  // LAUNCH Stage - Co-elevator
  '1': {
    stage: 'launch',
    tasks: [
      { agent: 'Dev Agent', task: 'Deploy production environment', status: 'completed' },
      { agent: 'Dev Agent', task: 'Configure Stripe billing', status: 'active' },
      { agent: 'Email Agent', task: 'Set up welcome email sequence', status: 'active' },
      { agent: 'Content Agent', task: 'Write launch blog post', status: 'pending' },
    ]
  },
  // LAUNCH Stage - IndiVillage
  '3': {
    stage: 'launch',
    tasks: [
      { agent: 'Dev Agent', task: 'Optimize checkout flow', status: 'active' },
      { agent: 'Email Agent', task: 'Artisan onboarding email series', status: 'completed' },
      { agent: 'Content Agent', task: 'Create social media launch content', status: 'active' },
    ]
  },
  // LAUNCH Stage - SlideArabi
  '5': {
    stage: 'launch',
    tasks: [
      { agent: 'Dev Agent', task: 'RTL text rendering fixes', status: 'active' },
      { agent: 'Content Agent', task: 'Arabic language marketing copy', status: 'completed' },
      { agent: 'Email Agent', task: 'Localized onboarding sequence', status: 'active' },
    ]
  },
  // GROW Stage - Parama.ai
  '2': {
    stage: 'grow',
    tasks: [
      { agent: 'Analytics Agent', task: 'Conversion funnel analysis', status: 'completed' },
      { agent: 'Content Agent', task: 'LinkedIn thought leadership posts', status: 'active' },
      { agent: 'Email Agent', task: 'Re-engagement campaign for churned users', status: 'active' },
    ]
  },
  // GROW Stage - InvoiceFlow
  '8': {
    stage: 'grow',
    tasks: [
      { agent: 'Analytics Agent', task: 'Customer cohort analysis', status: 'active' },
      { agent: 'Email Agent', task: 'Referral program email campaign', status: 'pending' },
      { agent: 'Content Agent', task: 'Case study: 50% faster payments', status: 'active' },
    ]
  },
  // SCALE Stage - DataNest
  '9': {
    stage: 'scale',
    tasks: [
      { agent: 'Dev Agent', task: 'Multi-region database replication', status: 'active' },
      { agent: 'Analytics Agent', task: 'Enterprise usage reporting', status: 'completed' },
      { agent: 'Research Agent', task: 'EU market expansion analysis', status: 'active' },
    ]
  },
};

// Mock Active Agents for Live Ops
export const mockActiveAgents: ActiveAgent[] = [
  { agent: mockAgents[0], currentTask: 'Building Workflows page with premium spacing', business: mockBusinesses[0], isActive: true },  // CME Copilot
  { agent: mockAgents[5], currentTask: 'Refining FlightDeck dashboard design', business: mockBusinesses[0], isActive: true },  // CME Copilot
  { agent: mockAgents[4], currentTask: 'Researching Claude Slack connector', business: mockBusinesses[0], isActive: false },  // CME Copilot
  { agent: mockAgents[1], currentTask: 'Drafting onboarding sequence', business: mockBusinesses[3], isActive: true },  // IndiVillage
  { agent: mockAgents[3], currentTask: 'Processing conversion data', business: mockBusinesses[4], isActive: true },  // Karma Street Wear
  { agent: mockAgents[2], currentTask: 'Writing launch blog post', business: mockBusinesses[5], isActive: true },  // SlideArabi
];

// Mock Interventions
export const mockInterventions: Intervention[] = [
  {
    id: '1',
    business_id: '1',
    agent_id: '1',
    type: 'approval',
    title: 'Stripe pricing tier change',
    context: 'Dev Agent wants to update the Pro tier from $29/mo to $39/mo based on competitor analysis. This will affect 8 existing customers.',
    status: 'pending',
    slack_sent: true,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    agent: mockAgents[0],
    business: mockBusinesses[1], // Co-elevator is now at index 1
  },
  {
    id: '2',
    business_id: '2',
    agent_id: '3',
    type: 'decision',
    title: 'Marketing channel priority',
    context: 'Content Agent found that LinkedIn is driving 3x more leads than Twitter. Should I reallocate content efforts to focus primarily on LinkedIn?',
    options: [
      { label: 'Focus on LinkedIn', value: 'linkedin' },
      { label: 'Keep Both', value: 'both' },
    ],
    status: 'pending',
    slack_sent: true,
    created_at: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    agent: mockAgents[2],
    business: mockBusinesses[2], // Parama.ai is now at index 2
  },
  {
    id: '3',
    business_id: '6',
    agent_id: '1',
    type: 'review',
    title: 'Terms of Service draft ready',
    context: 'Legal Agent has drafted the Terms of Service based on similar SaaS products. Ready for your review before publishing.',
    status: 'pending',
    slack_sent: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    agent: mockAgents[0],
    business: mockBusinesses[6], // StockClerk.ai is now at index 6
  },
];

// Mock Activity Feed
export const mockActivityFeed: ActivityFeedItem[] = [
  { id: '1', business_id: '11', agent_id: '1', type: 'success', message: 'Dev Agent updated Workflows page with locked design spacing', created_at: new Date().toISOString(), agent: mockAgents[0], business: mockBusinesses[0] },  // CME Copilot
  { id: '2', business_id: '11', agent_id: '6', type: 'success', message: 'Design Agent locked FlightDeck dashboard design specs', created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), agent: mockAgents[5], business: mockBusinesses[0] },  // CME Copilot
  { id: '3', business_id: '11', agent_id: '5', type: 'success', message: 'Research Agent completed Claude Slack connector analysis', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), agent: mockAgents[4], business: mockBusinesses[0] },  // CME Copilot
  { id: '4', business_id: '11', agent_id: '1', type: 'info', message: 'Dev Agent starting dashboard update for CME Copilot status', created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), agent: mockAgents[0], business: mockBusinesses[0] },  // CME Copilot
  { id: '5', business_id: '1', agent_id: '1', type: 'warning', message: 'Dev Agent waiting for pricing approval before going live', created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), agent: mockAgents[0], business: mockBusinesses[1] },  // Co-elevator
  { id: '6', business_id: '5', agent_id: '3', type: 'success', message: 'Content Agent published blog post: "5 Tips for Arabic Presentations"', created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(), agent: mockAgents[2], business: mockBusinesses[5] },  // SlideArabi
  { id: '7', business_id: '4', agent_id: '6', type: 'info', message: 'Design Agent generated 12 logo variations for review', created_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(), agent: mockAgents[5], business: mockBusinesses[4] },  // Karma Street Wear
  { id: '8', business_id: '1', agent_id: '2', type: 'success', message: 'Email Agent sent welcome email to 3 new trial users', created_at: new Date(Date.now() - 31 * 60 * 1000).toISOString(), agent: mockAgents[1], business: mockBusinesses[1] },  // Co-elevator
];

// Mock Stats
export const mockLiveStats: LiveStats = {
  tasksToday: 47,
  completed: 38,
  inProgress: 6,
  needsYou: 3,
};

// Helper to generate new random activity
export function generateRandomActivity(): ActivityFeedItem {
  const activities = [
    { type: 'success' as const, message: 'Dev Agent fixed responsive layout issue on mobile', agentIdx: 0, bizIdx: 0 },
    { type: 'info' as const, message: 'Email Agent A/B testing subject lines for campaign', agentIdx: 1, bizIdx: 1 },
    { type: 'info' as const, message: 'Research Agent identified 2 potential partnership opportunities', agentIdx: 4, bizIdx: 2 },
    { type: 'success' as const, message: 'Content Agent completed SEO optimization for landing page', agentIdx: 2, bizIdx: 4 },
    { type: 'success' as const, message: 'Analytics Agent generated weekly performance report', agentIdx: 3, bizIdx: 7 },
    { type: 'info' as const, message: 'Design Agent started working on new icon set', agentIdx: 5, bizIdx: 3 },
  ];

  const random = activities[Math.floor(Math.random() * activities.length)];
  return {
    id: crypto.randomUUID(),
    business_id: mockBusinesses[random.bizIdx].id,
    agent_id: mockAgents[random.agentIdx].id,
    type: random.type,
    message: random.message,
    created_at: new Date().toISOString(),
    agent: mockAgents[random.agentIdx],
    business: mockBusinesses[random.bizIdx],
  };
}
