import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Truck, 
  Wallet, 
  Bell, 
  User, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

const DeliveryLayout: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/delivery' },
    { icon: PackageSearch, label: 'Orders', path: '/delivery/available' },
    { icon: Truck, label: 'Deliveries', path: '/delivery/my-deliveries' },
    { icon: TrendingUp, label: 'Earnings', path: '/delivery/earnings' },
    { icon: User, label: 'Profile', path: '/delivery/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/delivery') return location.pathname === '/delivery';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Top Header - Minimal */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">MedSmart <span className="text-blue-600">Rider</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/delivery/notifications" className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>
          <Link to="/delivery/support" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <HelpCircle size={22} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/5 px-2 py-2 safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all relative ${active ? 'text-slate-900' : 'text-slate-400'}`}
              >
                {active && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-slate-100 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={20} className={active ? 'scale-110 transition-transform' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DeliveryLayout;
