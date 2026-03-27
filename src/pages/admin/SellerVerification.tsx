import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  MapPin, 
  User, 
  Calendar,
  History,
  Mail,
  MoreVertical,
  Flag,
  MessageSquare,
  Clock,
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, isPharmacyProfileComplete } from '../../services/api';
import { logFlow } from '../../utils/flowLogger';
import { logUI } from '../../utils/uiLogger';

const SellerVerification: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getPharmacies(statusFilter === 'all' ? {} : { status: statusFilter });
      setRequests(data);
      if (statusFilter === 'pending') {
        logFlow('ADMIN_PENDING_CHECK', {
          expected: { status: 'pending' },
          received: { count: data.length },
          success: true,
        });
      }
      logFlow('ADMIN_VERIFICATION_FETCH', {
        expected: { status: statusFilter },
        received: { count: data.length },
        success: true,
      });
    } catch (error) {
      logFlow('ADMIN_VERIFICATION_FETCH', {
        expected: { status: statusFilter },
        received: null,
        success: false,
        error,
      });
      console.error('Failed to fetch pharmacy requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string, reason?: string) => {
    setProcessing(true);
    try {
      logUI('ADMIN_SELLER_REVIEW', { context: `Set ${id} to ${newStatus}`, success: true });
      await api.updatePharmacy(id, {
        status: newStatus,
        rejectionReason: reason || '',
      });
      logFlow('ADMIN_VERIFICATION_UPDATE', {
        expected: { id, newStatus },
        received: { id, newStatus },
        success: true,
      });
      setRequests(requests.filter(r => r.id !== id));
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      logUI('ADMIN_SELLER_REVIEW', { context: `Set ${id} to ${newStatus}`, success: false, reason: (error as Error)?.message || 'update failed' });
      logFlow('ADMIN_VERIFICATION_UPDATE', {
        expected: { id, newStatus },
        received: null,
        success: false,
        error,
      });
      console.error('Failed to update pharmacy status', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Verification</h1>
          <p className="text-slate-500 text-sm">Review and manage pharmacy registration credentials</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['pending', 'verified', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                statusFilter === status 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search pharmacies..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Loading requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No {statusFilter} requests found.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`w-full p-4 text-left transition-all hover:bg-slate-50 ${
                      selectedRequest?.id === req.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 truncate">{req.name || 'Profile Incomplete'}</h3>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {req.address.city}, {req.address.state}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                        {req.verificationDetails?.licenseNumber || 'N/A'}
                      </span>
                      {!isPharmacyProfileComplete(req) && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold">PROFILE INCOMPLETE</span>
                      )}
                      {req.isPriority && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold">PRIORITY</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedRequest.name}</h2>
                      <p className="text-sm text-slate-500">Registration ID: {selectedRequest.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                      <Flag className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Owner Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Owner:</span>
                          <span className="font-medium text-slate-900">{selectedRequest.verificationDetails?.ownerName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Email:</span>
                          <span className="font-medium text-slate-900">{selectedRequest.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Submitted:</span>
                          <span className="font-medium text-slate-900">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Business Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">License:</span>
                          <span className="font-medium text-slate-900">{selectedRequest.verificationDetails?.licenseNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Expiry:</span>
                          <span className={`font-medium ${
                            new Date(selectedRequest.verificationDetails?.licenseExpiry) < new Date() ? 'text-red-600' : 'text-slate-900'
                          }`}>
                            {selectedRequest.verificationDetails?.licenseExpiry}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Location:</span>
                          <span className="font-medium text-slate-900 truncate">{selectedRequest.address.area}, {selectedRequest.address.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verification Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedRequest.verificationDetails?.documents?.map((doc: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-200 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{doc.type}</p>
                              <p className="text-xs text-slate-500">PDF Document</p>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-all">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  {statusFilter === 'pending' && (
                    <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                      <button 
                        onClick={() => handleStatusUpdate(selectedRequest.id, 'verified')}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70"
                      >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Approve Pharmacy
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(true)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-50 transition-all disabled:opacity-70"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject Request
                      </button>
                      <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {statusFilter === 'verified' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Verified on {new Date(selectedRequest.verifiedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-emerald-700">This pharmacy is active and can sell medicines on the platform.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 p-12">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Select a request to view details</p>
                <p className="text-sm">Verification documents and owner info will appear here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Registration</h3>
            <p className="text-slate-500 text-sm mb-4">Please provide a reason for rejection. This will be sent to the seller.</p>
            
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 min-h-[120px] mb-6"
              placeholder="e.g., License document is expired or blurry..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected', rejectionReason)}
                disabled={!rejectionReason || processing}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SellerVerification;
