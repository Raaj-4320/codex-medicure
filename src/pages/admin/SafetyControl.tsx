import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Package, 
  RefreshCcw, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Clock,
  Loader2,
  Calendar,
  Tag,
  ChevronRight,
  Plus,
  Bell
} from 'lucide-react';
import { MOCK_MEDICINE_CATALOG, MOCK_RECALLS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const SafetyControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'restricted' | 'batches' | 'recalls'>('restricted');
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState(MOCK_MEDICINE_CATALOG);
  const [recalls, setRecalls] = useState(MOCK_RECALLS);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRecall = (id: string, status: 'completed' | 'cancelled') => {
    setRecalls(recalls.map(r => r.id === id ? { ...r, status } : r));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medicine Control & Safety</h1>
          <p className="text-slate-500 text-sm">Manage restricted substances, track batches, and handle drug recalls</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'restricted', label: 'Restricted Drugs', icon: ShieldAlert },
            { id: 'batches', label: 'Batch Tracking', icon: Package },
            { id: 'recalls', label: 'Drug Recalls', icon: RefreshCcw }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'restricted' && (
          <motion.div
            key="restricted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900">Schedule X Drugs</h4>
                </div>
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500">Requires special storage & logging</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900">Schedule H Drugs</h4>
                </div>
                <p className="text-2xl font-bold text-slate-900">145</p>
                <p className="text-xs text-slate-500">Prescription mandatory for sale</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900">Active Alerts</h4>
                </div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p className="text-xs text-slate-500">Pending safety notifications</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Restricted Substance Catalog</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Control Level</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {medicines.filter(m => m.isRestricted).map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <p className="text-xs text-slate-500">{m.manufacturer}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {m.schedule}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                            m.schedule === 'Schedule X' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            <ShieldAlert className="w-3 h-3" />
                            {m.schedule === 'Schedule X' ? 'High Control' : 'Medium Control'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                            Mandatory
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'batches' && (
          <motion.div
            key="batches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Inventory Batch Tracking</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
                  <Plus className="w-3 h-3" /> Add Batch
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch No</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 'b1', no: 'BCH-2024-001', med: 'Paracetamol 500mg', expiry: '2025-12-31', qty: 5000, status: 'active' },
                      { id: 'b2', no: 'BCH-2024-002', med: 'Amoxicillin 250mg', expiry: '2024-06-15', qty: 1200, status: 'near-expiry' },
                      { id: 'b3', no: 'BCH-2024-003', med: 'Metformin 500mg', expiry: '2026-03-20', qty: 3000, status: 'active' },
                      { id: 'b4', no: 'BCH-2024-004', med: 'Atorvastatin 10mg', expiry: '2024-04-01', qty: 800, status: 'expired' }
                    ].map((batch) => (
                      <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{batch.no}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{batch.med}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {batch.expiry}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{batch.qty.toLocaleString()} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            batch.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                            batch.status === 'near-expiry' ? 'bg-orange-100 text-orange-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {batch.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recalls' && (
          <motion.div
            key="recalls"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-md transition-all">
                <RefreshCcw className="w-4 h-4" /> Initiate New Recall
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recalls.map((recall) => (
                <div key={recall.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    recall.status === 'initiated' ? 'bg-red-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <RefreshCcw className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-lg">Batch Recall: {recall.batchNumber}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            recall.status === 'initiated' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {recall.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">Reason: <span className="font-medium text-slate-900">{recall.reason}</span></p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Initiated: {new Date(recall.initiatedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Medicine ID: {recall.medicineId}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200">
                        View Details
                      </button>
                      {recall.status === 'initiated' && (
                        <button 
                          onClick={() => handleRecall(recall.id, 'completed')}
                          className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafetyControl;
