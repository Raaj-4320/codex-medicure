import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';

const ComplianceRisk: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getCompliance(statusFilter === 'all' ? {} : { status: statusFilter });
      setDocs(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load compliance documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    setError('');
    try {
      await api.updateCompliance(id, { status });
      await loadDocs();
    } catch (err: any) {
      setError(err?.message || 'Failed to update compliance status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compliance Verification</h1>
        <p className="text-slate-500 text-sm">Review seller compliance submissions and approve/reject.</p>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}

      <div className="bg-white p-3 rounded-xl border border-slate-200 inline-flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${statusFilter === status ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-300 text-center text-slate-600">No compliance documents found.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{doc.sellerId}</td>
                  <td className="px-4 py-3 capitalize">{doc.type}</td>
                  <td className="px-4 py-3 capitalize">{doc.status}</td>
                  <td className="px-4 py-3"><a href={doc.documentUrl} className="text-emerald-600 hover:underline" target="_blank" rel="noreferrer">View</a></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button disabled={updatingId === doc.id || doc.status === 'approved'} onClick={() => updateStatus(doc.id, 'approved')} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button disabled={updatingId === doc.id || doc.status === 'rejected'} onClick={() => updateStatus(doc.id, 'rejected')} className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplianceRisk;
