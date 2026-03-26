import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UserCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Loader2, 
  Calendar, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  AlertCircle,
  Maximize2,
  Download,
  MoreVertical,
  CheckCircle2,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';

const PrescriptionVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'doctors'>('pending');
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Failed to load prescriptions', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    await api.updatePrescription(id, { status });
    const data = await api.getPrescriptions();
    setPrescriptions(data);
    setSelectedPrescription(null);
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
          <h1 className="text-2xl font-bold text-slate-900">Prescription Verification</h1>
          <p className="text-slate-500 text-sm">Validate uploaded prescriptions and manage doctor registrations</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'pending', label: 'Pending Review', icon: Clock },
            { id: 'verified', label: 'Verified History', icon: CheckCircle2 },
            { id: 'doctors', label: 'Doctor Directory', icon: Stethoscope }
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
        {activeTab === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Queue: {prescriptions.filter(p => p.status === 'pending').length} Pending</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                {prescriptions.filter(p => p.status === 'pending').map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedPrescription(p)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-all ${
                      selectedPrescription?.id === p.id ? 'bg-emerald-50/50 border-l-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                          {p.customerId.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Customer: {p.customerId}</p>
                          <p className="text-[10px] text-slate-500">Uploaded: {new Date(p.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              {selectedPrescription ? (
                <>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Reviewing: {selectedPrescription.id}</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-6 bg-slate-900 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-white rounded-lg shadow-2xl flex items-center justify-center relative group">
                      <img 
                        src={selectedPrescription.imageUrl} 
                        alt="Prescription" 
                        className="max-w-full max-h-full object-contain p-4"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm">Click to Zoom</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">OCR Analysis (Simulated)</p>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-xs font-bold">Doctor ID Found: REG-4452</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Score</p>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <Activity className="w-4 h-4" />
                          <span className="text-xs font-bold">Low Risk (98% Confidence)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleVerify(selectedPrescription.id, 'rejected')}
                        className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-100"
                      >
                        Reject Prescription
                      </button>
                      <button 
                        onClick={() => handleVerify(selectedPrescription.id, 'approved')}
                        className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium">Select a prescription from the queue to review</p>
                  <p className="text-xs">AI-assisted OCR will automatically highlight key details</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'verified' && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Verification History</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reviewed</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prescriptions.filter(p => p.status !== 'pending').map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{p.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.customerId}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{new Date(p.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">{p.reviewedAt ? new Date(p.reviewedAt).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.status}
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
          </motion.div>
        )}

        {activeTab === 'doctors' && (
          <motion.div
            key="doctors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { id: 'd1', name: 'Dr. Sarah Wilson', reg: 'REG-4452', specialty: 'General Physician', status: 'verified' },
              { id: 'd2', name: 'Dr. Michael Chen', reg: 'REG-9921', specialty: 'Cardiologist', status: 'verified' },
              { id: 'd3', name: 'Dr. Elena Rodriguez', reg: 'REG-1105', specialty: 'Pediatrician', status: 'pending' },
              { id: 'd4', name: 'Dr. James Miller', reg: 'REG-7734', specialty: 'Dermatologist', status: 'verified' }
            ].map((doc) => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500">{doc.specialty}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    doc.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>Reg No: <span className="font-mono font-bold text-slate-700">{doc.reg}</span></span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-100">
                    View Profile
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrescriptionVerification;
