import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LogOut, Home, Store, Trophy, User } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Shop', path: '/shop', icon: Store },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div 
      className="min-h-screen bg-background text-slate-100 font-sans transition-all duration-500 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: user?.currentBackground ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(${user.currentBackground})` : 'none',
        backgroundColor: user?.currentBackground ? 'transparent' : undefined
      }}
    >
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">HealthQuest</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-4 mr-4">
                  <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                    <span>Lvl {user.level}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
                    <span>{user.coins} Coins</span>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 p-4 border-b md:border-b-0 md:border-r border-slate-800 bg-surface/30 md:min-h-[calc(100vh-4rem)]">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
