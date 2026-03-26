import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  MessageCircle, 
  FileText, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Mail, 
  Phone, 
  MessageSquare, 
  ArrowRight,
  Send,
  X,
  Paperclip,
  MoreVertical,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportTicket } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';

const Support: React.FC = () => {
  const { profile } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTickets = async () => {
    if (!profile) return;
    try {
      const data = await api.getTickets({ userId: profile.uid });
      setTickets(data as SupportTicket[]);
    } catch (error) {
      console.error('Failed to load tickets', error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [profile]);

  const faqs = [
    { q: "How do I update my bank details?", a: "You can update your bank details in the Store Profile > Bank & Payouts section. Changes require verification and take 2-3 business days." },
    { q: "What is the commission structure?", a: "MedSmart charges a flat 10% commission on all successful orders. This includes platform fees, payment gateway charges, and basic logistics support." },
    { q: "How to handle prescription verification?", a: "Go to the Prescriptions tab, review the uploaded image against the extracted data, and either approve, reject, or request a re-upload." },
    { q: "When will I receive my payouts?", a: "Settlements are processed every Monday for the previous week's delivered orders (Mon-Sun)." },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Center</h1>
          <p className="text-slate-500 text-sm">Get help with your store, orders, or technical issues</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-2xl text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            <MessageCircle className="w-5 h-5" />
            Live Chat
          </button>
          <button 
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-2xl text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Plus className="w-5 h-5" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Support Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {[
          { id: 'tickets', label: 'My Tickets', icon: History },
          { id: 'faq', label: 'Knowledge Base', icon: HelpCircle },
          { id: 'contact', label: 'Contact Us', icon: Phone },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tickets' && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Open Tickets</p>
                  <h3 className="text-2xl font-bold text-slate-900">02</h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resolved</p>
                  <h3 className="text-2xl font-bold text-slate-900">14</h3>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Response</p>
                  <h3 className="text-2xl font-bold text-slate-900">2.4h</h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Support Requests</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search tickets..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {tickets
                  .filter(ticket => ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || (ticket.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(ticket => (
                  <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{ticket.subject}</h4>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${ticket.priority === 'high' ? 'bg-rose-100 text-rose-700' : ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>ID: {ticket.id}</span>
                            <span>Category: {ticket.category}</span>
                            <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${ticket.status === 'open' ? 'bg-blue-50 text-blue-600 border-blue-100' : ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full p-4 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors border-t border-slate-100">
                View All Support History
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search help articles, guides, and FAQs..."
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-3xl text-lg shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{faq.q}</h4>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
                <h3 className="text-xl font-bold mb-4">Need more help?</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 opacity-80">
                  Our dedicated seller support team is available 24/7 to assist you with any platform-related issues.
                </p>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-bold">Live Chat</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-bold">Email Support</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                </div>
              </div>
              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">Seller Academy</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mb-6">
                  Learn how to grow your pharmacy business on MedSmart with our expert-led guides and webinars.
                </p>
                <button className="text-sm font-bold text-emerald-600 flex items-center gap-2 hover:underline">
                  Browse Courses
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email Support</h4>
                <p className="text-xs text-slate-500 mt-1">Response within 24 hours</p>
              </div>
              <p className="text-sm font-bold text-blue-600">sellers@medsmart.com</p>
              <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
                Send Email
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Phone Support</h4>
                <p className="text-xs text-slate-500 mt-1">Mon-Sat, 9 AM - 8 PM</p>
              </div>
              <p className="text-sm font-bold text-emerald-600">+91 1800-123-4567</p>
              <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
                Call Now
              </button>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Corporate Office</h4>
                <p className="text-xs text-slate-500 mt-1">Visit us for partnerships</p>
              </div>
              <p className="text-sm font-bold text-indigo-600">Bangalore, India</p>
              <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
                View Address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTicketModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Raise New Support Ticket</h3>
                  <button onClick={() => setShowNewTicketModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Category</label>
                    <select id="ticket-category" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                      <option>Order Issues</option>
                      <option>Payment & Payouts</option>
                      <option>Inventory & Catalog</option>
                      <option>Compliance & License</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Subject</label>
                    <input id="ticket-subject" type="text" placeholder="Briefly describe the issue" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description</label>
                    <textarea 
                      id="ticket-description"
                      rows={4} 
                      placeholder="Provide detailed information about your problem..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed cursor-pointer hover:bg-slate-100 transition-all group">
                    <Paperclip className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                    <span className="text-xs font-bold text-slate-500">Attach screenshots or documents (Optional)</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!profile) return;
                      const category = (document.getElementById('ticket-category') as HTMLSelectElement)?.value || 'Other';
                      const subject = (document.getElementById('ticket-subject') as HTMLInputElement)?.value || '';
                      const description = (document.getElementById('ticket-description') as HTMLTextAreaElement)?.value || '';
                      if (!subject || !description) return;
                      await api.createTicket({
                        userId: profile.uid,
                        category: category.toLowerCase().includes('payment') ? 'payout' : category.toLowerCase().includes('inventory') ? 'inventory' : category.toLowerCase().includes('technical') ? 'technical' : 'order',
                        subject,
                        description,
                        message: description,
                        priority: 'medium',
                      });
                      await loadTickets();
                      setShowNewTicketModal(false);
                    }}
                    className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default Support;
