import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Download, 
  Search, 
  Filter, 
  History, 
  Plus,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ComplianceDocument } from '../../types';
import { MOCK_COMPLIANCE_DOCS } from '../../staticData';

const Compliance: React.FC = () => {
  const [docs, setDocs] = useState<ComplianceDocument[]>([]);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'expired'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    setDocs(MOCK_COMPLIANCE_DOCS as ComplianceDocument[]);
  }, []);

  const filteredDocs = docs.filter(d => filter === 'all' || d.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'expired': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <ShieldAlert className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Center</h1>
          <p className="text-slate-500 text-sm">Manage your licenses, certifications, and regulatory audits</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-2xl text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="w-5 h-5" />
          Upload Document
        </button>
      </div>

      {/* Compliance Health Score */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ShieldCheck className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Compliance Health: Excellent</h3>
            </div>
            <p className="text-emerald-50 text-sm max-w-md leading-relaxed opacity-90">
              Your store is currently 100% compliant with all MedSmart and regulatory requirements. All critical licenses are verified and active.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Verified Docs</p>
                <p className="text-2xl font-bold">08</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Pending Review</p>
                <p className="text-2xl font-bold">01</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Expiring Soon</p>
                <p className="text-2xl font-bold">00</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.85" strokeDashoffset="35.18" className="text-white" strokeLinecap="round" />
              </svg>
              <span className="absolute text-3xl font-bold">90%</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Trust Score</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {(['all', 'verified', 'pending', 'expired'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all whitespace-nowrap ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents by name or ID..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, idx) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${getStatusColor(doc.status)} border`}>
                  {getStatusIcon(doc.status)}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-rose-50 rounded-xl transition-colors group/del">
                    <Trash2 className="w-4 h-4 text-slate-400 group-hover/del:text-rose-600" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{doc.type}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {doc.id}</p>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className={`font-bold capitalize ${doc.status === 'verified' ? 'text-emerald-600' : doc.status === 'expired' ? 'text-rose-600' : 'text-amber-600'}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Expiry Date</span>
                  <span className="text-slate-900 font-bold">{new Date(doc.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Last Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
              <button className="text-[10px] font-bold text-emerald-600 uppercase hover:underline flex items-center gap-1">
                Renew Now
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add Placeholder */}
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 space-y-4 group hover:border-emerald-500 hover:bg-emerald-50 transition-all"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-emerald-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">Add New Document</p>
            <p className="text-xs text-slate-500 mt-1">Upload license, GST, or bank details</p>
          </div>
        </button>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Compliance Audit Logs</h3>
          </div>
          <button className="text-xs font-bold text-emerald-600 hover:underline">View Full Audit Trail</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performed By</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { action: 'Verification Approved', doc: 'Drug License (Form 20)', by: 'Admin (System)', time: '2024-03-15 14:20', status: 'Success' },
                { action: 'Document Uploaded', doc: 'GST Certificate', by: 'Store Manager', time: '2024-03-14 10:45', status: 'Pending' },
                { action: 'License Renewal Triggered', doc: 'Trade License', by: 'System Auto', time: '2024-03-10 09:00', status: 'Success' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{log.action}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{log.doc}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{log.by}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
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
                  <h3 className="text-xl font-bold text-slate-900">Upload Compliance Document</h3>
                  <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Document Type</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                      <option>Drug License (Form 20/21)</option>
                      <option>GST Registration Certificate</option>
                      <option>Trade License</option>
                      <option>FSSAI License</option>
                      <option>Pharmacist Registration</option>
                      <option>Bank Passbook/Cancelled Cheque</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Document ID / No.</label>
                      <input type="text" placeholder="e.g. DL-12345" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Expiry Date</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                    </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center space-y-3 group hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                    Submit for Verification
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

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Compliance;
