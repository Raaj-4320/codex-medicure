import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronRight, 
  HelpCircle, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { MOCK_SUPPORT_TICKETS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const DeliverySupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'order', message: '' });

  const tickets = MOCK_SUPPORT_TICKETS.filter(t => t.userId === 'delivery-1' || t.userId === 'seller-1'); // Mocking for now

  const faqs = [
    { q: 'How do I withdraw my earnings?', a: 'Go to the Wallet section and click on Withdraw. Your request will be processed within 24-48 hours.' },
    { q: 'What to do if customer is unavailable?', a: 'Try calling the customer twice. If still unavailable, mark the delivery as failed with the reason "Customer Unavailable".' },
    { q: 'How to handle cold-chain medicines?', a: 'Always use an insulated bag with ice packs. Ensure the temperature stays between 2-8°C during transit.' },
    { q: 'My order was rejected by seller, why?', a: 'Sellers may reject orders if stock is unavailable or if the prescription is invalid.' }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Support Center</h2>
        <button 
          onClick={() => setShowNewTicket(true)}
          className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
            <Phone size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Call Support</h4>
          <p className="text-[10px] text-slate-500 mt-1">Available 24/7</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
            <MessageSquare size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Live Chat</h4>
          <p className="text-[10px] text-slate-500 mt-1">Typical reply: 5m</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'tickets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          My Tickets
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'faq' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
        >
          FAQs
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white p-5 rounded-3xl shadow-sm border border-black/5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ticket.subject}</h4>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ticket.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {ticket.priority}
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {ticket.message}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock size={12} />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <button className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  View Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search help topics..."
              className="w-full bg-white border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none shadow-sm"
            />
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-black/5">
                <h4 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 sm:pb-8"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900">Raise a Ticket</h3>
                <p className="text-sm text-slate-500 mt-2">Our team will get back to you shortly.</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Category</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-slate-900 outline-none appearance-none"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  >
                    <option value="order">Order Issue</option>
                    <option value="payout">Payout Issue</option>
                    <option value="inventory">App Issue</option>
                    <option value="account">Account Issue</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Briefly describe the issue"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-slate-900 outline-none"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide more details..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-slate-900 outline-none resize-none"
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  />
                </div>
              </div>

              <button 
                onClick={() => setShowNewTicket(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-transform active:scale-95"
              >
                Submit Ticket
              </button>
              
              <button 
                onClick={() => setShowNewTicket(false)}
                className="w-full py-4 text-slate-400 font-bold mt-2"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliverySupport;
