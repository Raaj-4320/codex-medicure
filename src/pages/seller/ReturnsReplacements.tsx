import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Clock, 
  ChevronRight,
  Package,
  User,
  MoreVertical,
  ArrowRight,
  Undo2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReturnRequest } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';

const ReturnsReplacements: React.FC = () => {
  const { profile } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'refunded' | 'replaced'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      try {
        await loadReturns();
      } catch (error: any) {
        setErrorMessage(error?.message || 'Failed to fetch returns');
      }
    };
    load();
  }, [profile]);

  const filteredReturns = returns.filter(ret => {
    const matchesFilter = filter === 'all' || ret.status === filter;
    const matchesSearch = ret.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ret.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const loadReturns = async () => {
    if (!profile) return;
    const pharmacies = await api.getPharmacies({ ownerId: profile.uid });
    if (!pharmacies.length) {
      setErrorMessage('No pharmacy found for this seller account.');
      setReturns([]);
      return;
    }
    setErrorMessage('');
    const data = await api.getReturns({ pharmacyId: pharmacies[0].id });
    setReturns(data as ReturnRequest[]);
  };

  const updateStatus = async (id: string, status: ReturnRequest['status']) => {
    setProcessingId(id);
    setErrorMessage('');
    try {
      await api.updateReturn(id, { status });
      await loadReturns();
      setSelectedReturn(null);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to update return');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Returns & Replacements</h1>
          <p className="text-slate-500 text-sm">Manage customer return requests and reverse logistics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-700">3 Pending Actions</span>
          </div>
        </div>
      </div>

      {errorMessage && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{errorMessage}</div>}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'pending', 'approved', 'refunded', 'replaced'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-4">
        {filteredReturns.map((ret) => (
          <motion.div
            layout
            key={ret.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Order #{ret.orderId.slice(-6)}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(ret.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    ret.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    ret.status === 'refunded' ? 'bg-emerald-50 text-emerald-600' :
                    ret.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {ret.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reason</p>
                    <p className="text-xs font-bold text-slate-900 capitalize">{ret.reason.replace('_', ' ')}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer</p>
                    <p className="text-xs font-bold text-slate-900">{ret.customerId}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Items</p>
                    <p className="text-xs font-bold text-slate-900">{ret.items.length} Item(s)</p>
                  </div>
                </div>

                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-red-700">Customer Note:</span> "{ret.description}"
                  </p>
                </div>
              </div>

              <div className="lg:w-48 flex flex-col gap-2">
                {ret.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => setSelectedReturn(ret)}
                      className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                    >
                      Process Request
                    </button>
                    <button 
                      onClick={() => updateStatus(ret.id, 'rejected')}
                      disabled={processingId === ret.id}
                      className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button className="w-full py-2.5 bg-slate-50 text-slate-400 rounded-xl text-sm font-bold border border-dashed border-slate-200 cursor-default flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Processed
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Process Modal */}
      <AnimatePresence>
        {selectedReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Process Return</h2>
                <button 
                  onClick={() => setSelectedReturn(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase">Items to Return</p>
                    {selectedReturn.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">{item.medicineName}</span>
                        <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Resolution Action</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50 text-emerald-700 transition-all">
                        <Undo2 className="w-6 h-6" />
                        <span className="text-xs font-bold">Full Refund</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-all">
                        <Truck className="w-6 h-6" />
                        <span className="text-xs font-bold">Replacement</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                      Approving this will trigger a reverse pickup. Ensure the customer is notified about the pickup schedule.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedReturn(null)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => updateStatus(selectedReturn.id, 'refunded')}
                  disabled={processingId === selectedReturn.id}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Confirm & Refund
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReturnsReplacements;
