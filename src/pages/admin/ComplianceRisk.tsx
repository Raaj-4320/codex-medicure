import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  History, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  User,
  Clock,
  Globe,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { MOCK_AUDIT_LOGS, MOCK_FRAUD_ALERTS, MOCK_PHARMACIES } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const ComplianceRisk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'fraud' | 'audit'>('verification');
  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState(MOCK_PHARMACIES);
  const [fraudAlerts, setFraudAlerts] = useState(MOCK_FRAUD_ALERTS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = (id: string, status: 'verified' | 'rejected') => {
    setPharmacies(pharmacies.map(p => p.id === id ? { ...p, verificationStatus: status } : p));
    // Add to audit log
    const newLog = {
      id: `log-${Date.now()}`,
      adminId: 'admin-1',
      adminName: 'System Admin',
      action: status === 'verified' ? 'Approved Pharmacy' : 'Rejected Pharmacy',
      targetId: id,
      targetType: 'pharmacy' as const,
      details: `Status changed to ${status}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1'
    };
    setAuditLogs([newLog, ...auditLogs]);
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
          <h1 className="text-2xl font-bold text-slate-900">Risk & Compliance</h1>
          <p className="text-slate-500 text-sm">Monitor regulatory compliance and detect fraudulent activities</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'verification', label: 'Verifications', icon: ShieldCheck },
            { id: 'fraud', label: 'Fraud Alerts', icon: AlertOctagon },
            { id: 'audit', label: 'Audit Logs', icon: History }
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
        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Pending License Verifications</h3>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-bold text-emerald-600 hover:underline">Verify All via Govt API</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pharmacy</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">License ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Govt Sync</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pharmacies.filter(p => p.verificationStatus === 'pending').map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.address.city}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-600">{p.verificationDetails?.licenseNumber}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{p.verificationDetails?.licenseExpiry}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle className="w-3 h-3" /> Validated
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleVerify(p.id, 'verified')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleVerify(p.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'fraud' && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Fraud Detection Alert</h4>
                      <p className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.status === 'investigating' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {alert.reason}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Target: <span className="font-bold text-slate-700">{alert.targetId}</span> ({alert.targetType})
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-700">Dismiss</button>
                    <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">System Audit Logs</h3>
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
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {log.adminName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{log.adminName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">{log.action}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-500">{log.targetType}: {log.targetId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{log.details}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Globe className="w-3 h-3" />
                          {log.ipAddress}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplianceRisk;
