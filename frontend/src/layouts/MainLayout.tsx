import React from 'react';
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
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Internal Standards</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
