import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShoppingBag, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Info, 
  ShieldCheck, 
  Trash2, 
  Check, 
  MoreVertical, 
  Search, 
  Filter, 
  Settings,
  X,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';

const SellerNotifications: React.FC = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'inventory' | 'compliance' | 'system'>('all');

  const loadNotifications = async () => {
    if (!profile) return;
    try {
      const data = await api.getNotifications({ userId: profile.uid });
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [profile]);

  const filteredNotifications = notifications.filter(n => {
    const statusMatch = filter === 'all' || (filter === 'unread' ? !n.isRead : n.isRead);
    const typeMatch = typeFilter === 'all' || (n.type === typeFilter || (typeFilter === 'inventory' && n.type === 'stock'));
    return statusMatch && typeMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-amber-600" />;
      case 'compliance': return <ShieldCheck className="w-5 h-5 text-rose-600" />;
      case 'system': return <Info className="w-5 h-5 text-indigo-600" />;
      default: return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-50';
      case 'inventory': return 'bg-amber-50';
      case 'compliance': return 'bg-rose-50';
      case 'system': return 'bg-indigo-50';
      default: return 'bg-slate-50';
    }
  };

  const markAllAsRead = () => {
    Promise.all(
      notifications.filter((n) => !n.isRead).map((n) => api.updateNotification(n.id, { isRead: true }))
    )
      .then(() => loadNotifications())
      .catch((error) => console.error('Failed to mark all as read', error));
  };

  const deleteNotification = (id: string) => {
    api.deleteNotification(id)
      .then(() => setNotifications(prev => prev.filter(n => n.id !== id)))
      .catch((error) => console.error('Failed to delete notification', error));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated with orders, inventory alerts, and platform news</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all whitespace-nowrap ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-2 shrink-0" />
          {(['all', 'order', 'inventory', 'compliance', 'system'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all whitespace-nowrap ${typeFilter === t ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, idx) => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-6 hover:bg-slate-50 transition-all group flex items-start gap-6 ${!notification.isRead ? 'bg-emerald-50/30' : ''}`}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${getBgColor(notification.type)} group-hover:scale-110 transition-transform relative`}>
                    {getIcon(notification.type)}
                    {!notification.isRead && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-[10px] font-bold text-emerald-600 uppercase hover:underline flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      {!notification.isRead && (
                        <button
                          onClick={async () => {
                            await api.updateNotification(notification.id, { isRead: true });
                            await loadNotifications();
                          }}
                          className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-6 bg-slate-50 rounded-full">
                  <Bell className="w-12 h-12 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No notifications found</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    We'll notify you when something important happens with your store.
                  </p>
                </div>
                <button 
                  onClick={() => {setFilter('all'); setTypeFilter('all');}}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Manage Notification Preferences</h3>
          <p className="text-slate-400 text-sm opacity-80 max-w-md">
            Choose how you want to be notified about orders, inventory, and platform updates.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Email</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">SMS</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Push</span>
          </div>
          <button className="ml-4 px-6 py-3 border border-white/20 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all">
            Configure All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerNotifications;
