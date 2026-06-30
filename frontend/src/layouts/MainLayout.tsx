import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { 
  Sun, 
  Moon, 
  Compass, 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  LogOut
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFooterTab, setActiveFooterTab] = useState<'standards' | 'privacy' | 'support' | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Compass, roles: ['employee', 'admin'] },
    { name: 'Modules', path: '/modules', icon: BookOpen, roles: ['employee', 'admin'] },
    { name: 'Resources', path: '/resources', icon: BookOpen, roles: ['employee', 'admin'] },
    { name: 'Assessments', path: '/assessments', icon: CheckSquare, roles: ['employee'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart2, roles: ['admin'] },
    { name: 'Admin Hub', path: '/admin', icon: Settings, roles: ['admin'] },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-all duration-300">

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="ATR Studio Logo" className="h-9 w-9 rounded-[10px] object-cover shadow-sm border border-border/85" />
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-wider text-sm leading-tight text-foreground">ATR STUDIO</span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-mono">Foundation</span>
              </div>
            </Link>

            {user && (
              <nav className="hidden md:flex items-center gap-1.5">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-universal'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user.role} • {user.department}</span>
                </div>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 ATR Design Studio. All rights reserved.</span>
            <span>•</span>
            <span className="font-semibold text-primary">ATR Foundation v1.0.0</span>
          </div>
          <div className="flex gap-4 animate-in fade-in duration-200">
            <span onClick={() => setActiveFooterTab('standards')} className="hover:underline cursor-pointer">Internal Standards</span>
            <span onClick={() => setActiveFooterTab('privacy')} className="hover:underline cursor-pointer">Privacy Policy</span>
            <span onClick={() => setActiveFooterTab('support')} className="hover:underline cursor-pointer">Support</span>
          </div>
        </div>
      </footer>

      {/* Footer Details Modals */}
      {activeFooterTab && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-card p-6 sm:p-8 max-w-lg w-full shadow-universal space-y-6 text-left relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="text-lg font-bold font-display text-foreground">
                {activeFooterTab === 'standards' && 'Internal Design Standards'}
                {activeFooterTab === 'privacy' && 'Privacy & Data Policy'}
                {activeFooterTab === 'support' && 'Studio Help & Support'}
              </h3>
              <button
                onClick={() => setActiveFooterTab(null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 bg-secondary rounded-lg border border-border"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {activeFooterTab === 'standards' && (
                <div className="space-y-4">
                  <p>
                    The ATR Studio Internal Design Standards are currently being curated by the Design Committee. 
                    This resource will house the unified CAD layering protocols, Revit family standards, and BIM file organization rules.
                  </p>
                  <div className="p-4 bg-accent/10 border border-accent/25 rounded-2xl">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-accent-foreground font-mono block mb-1">Status</span>
                    <p className="text-xs text-foreground font-medium">Under curation by the Design Committee. Estimated release: Q3 2026.</p>
                  </div>
                </div>
              )}

              {activeFooterTab === 'privacy' && (
                <div className="space-y-4">
                  <p>
                    ATR Design Studio is committed to protecting employee data privacy. This onboarding and evaluation portal adheres to the following privacy guidelines:
                  </p>
                  <ul className="space-y-2.5 list-disc pl-5 text-foreground">
                    <li>
                      <strong className="text-foreground">Authentication</strong>: User authentication is processed securely using Google SSO. Standard email passwords are not collected or stored.
                    </li>
                    <li>
                      <strong className="text-foreground">Data Storage</strong>: All employee learning paths, module milestones, and assessment attempt scores are securely logged on a cloud-hosted PostgreSQL database deployed via Render.
                    </li>
                    <li>
                      <strong className="text-foreground">Access Rules</strong>: Progress analytics and assessment attempt breakdowns are strictly restricted to Studio Directors, Human Resources, and the respective Onboardee. Anonymous or public access is prohibited.
                    </li>
                  </ul>
                </div>
              )}

              {activeFooterTab === 'support' && (
                <div className="space-y-4">
                  <p>
                    If you experience technical issues with your workspace profile, need portal support, or have curriculum questions, please refer to the directory below:
                  </p>
                  <div className="grid grid-cols-1 gap-3.5 pt-2">
                    <div className="p-3.5 bg-secondary/60 border border-border/80 rounded-2xl space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground font-mono">Primary Help Desk</span>
                      <a href="mailto:atrstudiofoundation@gmail.com" className="text-xs font-semibold text-primary hover:underline block">atrstudiofoundation@gmail.com</a>
                    </div>
                    <div className="p-3.5 bg-secondary/60 border border-border/80 rounded-2xl space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground font-mono">Backup Administrator</span>
                      <a href="mailto:mayankgangrediwar@gmail.com" className="text-xs font-semibold text-primary hover:underline block">mayankgangrediwar@gmail.com</a>
                    </div>
                    <div className="p-3.5 bg-secondary/60 border border-border/80 rounded-2xl space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground font-mono">Curriculum Incharge</span>
                      <p className="text-xs font-semibold text-foreground font-display">Tejaal Rakshamwar</p>
                    </div>
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 font-mono">Assessment Attempt Policy</span>
                      <p className="text-xs text-foreground font-medium">Onboardees can currently attempt module tests an infinite number of times. You do not need to contact support to request exam resets.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
