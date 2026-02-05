import { Link, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, GitBranch, Plus } from 'lucide-react';

interface NavigationProps {
  variant?: 'default' | 'live-ops' | 'workflows' | 'onboarding';
  agentCount?: number;
  currentPage?: 'live-ops' | 'workflows' | 'onboard';
}

export default function Navigation({ variant = 'default', agentCount }: NavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/live-ops', label: 'Live Ops', icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/workflows', label: 'Workflows', icon: <GitBranch className="w-4 h-4" /> },
    { path: '/onboard', label: 'Add Business', icon: <Plus className="w-4 h-4" /> },
  ];

  const getBadgeConfig = () => {
    switch (variant) {
      case 'live-ops':
        return { color: 'bg-[#22C55E]', label: 'Live Operations' };
      case 'workflows':
        return { color: 'bg-[#22C55E]', label: 'Workflows' };
      case 'onboarding':
        return { color: 'bg-[#8B5CF6]', label: 'Add Business' };
      default:
        return { color: 'bg-[#22C55E]', label: 'FlightDeck' };
    }
  };

  const badge = getBadgeConfig();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-[#0D0D0D] border-b border-[#1C1C1E]">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <Link to="/live-ops" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#0D0D0D] font-bold text-base">
            F
          </div>
          <span className="text-[15px] font-semibold text-white">FlightDeck</span>
        </Link>

        {/* Page Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full ${badge.color}`}>
          {variant === 'live-ops' && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          )}
          {variant !== 'live-ops' && <Zap className="w-3.5 h-3.5 text-white" />}
          <span className="text-[12px] font-semibold text-white">{badge.label}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Agent count for Live Ops */}
        {variant === 'live-ops' && agentCount !== undefined && (
          <span className="text-[13px] text-[#8E8E93]">
            <strong className="text-white">{agentCount}</strong> agents active
          </span>
        )}

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path ||
              (item.path === '/onboard' && currentPath === '/onboarding');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-[#0D0D0D]'
                    : 'bg-[#1A1A1C] text-[#8E8E93] hover:bg-[#2A2A2E] hover:text-white'
                }`}
                style={{ boxShadow: isActive ? 'none' : '0 0 0 1px rgba(255,255,255,0.05)' }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
