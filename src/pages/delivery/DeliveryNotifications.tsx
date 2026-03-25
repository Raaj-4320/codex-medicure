import React, { useState } from 'react';
import { 
  Bell, 
  Package, 
  DollarSign, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const DeliveryNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS.filter(n => n.userId === 'delivery-1'));

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package size={20} />;
      case 'payout': return <DollarSign size={20} />;
      case 'compliance': return <ShieldCheck size={20} />;
      case 'stock': return <AlertCircle size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-50 text-blue-600';
      case 'payout': return 'bg-emerald-50 text-emerald-600';
      case 'compliance': return 'bg-purple-50 text-purple-600';
      case 'stock': return 'bg-orange-50 text-orange-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <button 
          onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
          className="text-xs font-bold text-blue-600"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div 
              key={notification.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex gap-4 relative overflow-hidden ${!notification.isRead ? 'border-l-4 border-l-blue-600' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold text-slate-900 truncate pr-4 ${!notification.isRead ? 'font-extrabold' : ''}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex gap-4 mt-3">
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-wider"
                    >
                      Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Bell size={32} />
            </div>
            <h3 className="font-bold text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">No new notifications for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryNotifications;
