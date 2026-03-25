import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  XCircle,
  Clock,
  Package,
  Loader2
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const MyDeliveries: React.FC = () => {
  const { profile } = useAuth();
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<'pickup' | 'delivery' | 'completed'>('pickup');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const assignments = await api.getDeliveryAssignments({ 
        deliveryStaffId: profile?.uid,
        status: 'assigned' 
      });
      
      if (assignments.length > 0) {
        const assignment = assignments[0];
        setActiveAssignment(assignment);
        
        const order = await api.getOrders({ id: assignment.orderId } as any);
        if (Array.isArray(order)) {
          setActiveOrder(order[0]);
          // Determine step based on order status
          if (order[0].status === 'on_the_way') setActiveStep('pickup');
          if (order[0].status === 'picked_up') setActiveStep('delivery');
          if (order[0].status === 'delivered') setActiveStep('completed');
        } else {
          setActiveOrder(order);
          if (order.status === 'on_the_way') setActiveStep('pickup');
          if (order.status === 'picked_up') setActiveStep('delivery');
          if (order.status === 'delivered') setActiveStep('completed');
        }
      } else {
        setActiveAssignment(null);
        setActiveOrder(null);
      }
    } catch (error) {
      console.error('Failed to fetch delivery data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [profile]);

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      if (activeStep === 'pickup') {
        // 1. Update order status to 'picked_up'
        await api.updateOrder(activeOrder.id, { status: 'picked_up' });
        setActiveStep('delivery');
      } else {
        // 1. Update order status to 'delivered'
        await api.updateOrder(activeOrder.id, { status: 'delivered' });
        // 2. Update assignment status to 'completed'
        await api.updateDeliveryAssignment(activeAssignment.id, { status: 'completed' });
        setActiveStep('completed');
      }
      setShowOtpModal(false);
      setOtpValue('');
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCaptureProof = () => {
    setProofImage('https://picsum.photos/seed/proof/400/300');
    setTimeout(() => setShowProofModal(false), 1000);
  };

  const MOCK_CHATS = [
    { id: '1', senderId: 'customer', message: 'Where are you?', timestamp: new Date().toISOString() },
    { id: '2', senderId: 'rider', message: 'I am near the pharmacy.', timestamp: new Date().toISOString() },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500">Loading active delivery...</p>
      </div>
    );
  }

  if (!activeAssignment || !activeOrder) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Package size={32} />
        </div>
        <h3 className="font-bold text-slate-900">No active delivery</h3>
        <p className="text-sm text-slate-500 mt-1">Accept an order from the "Available Orders" tab to start.</p>
      </div>
    );
  }

  if (activeStep === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Delivery Successful!</h2>
        <p className="text-slate-500 mb-8">You've earned ₹40.00 for this delivery. Great job!</p>
        <button 
          onClick={() => setActiveStep('pickup')}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-8 shadow-lg shadow-slate-200 transition-transform active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-black/5 text-slate-600">
            <ArrowLeft size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Order #ORD-7892</h2>
            <p className="text-xs text-slate-500">
              {activeStep === 'pickup' ? 'Heading to Pharmacy' : 'Heading to Customer'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowChat(true)}
            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center relative"
          >
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          </button>
          <button className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Map Preview (Mock) */}
      <div className="relative h-64 bg-slate-100 rounded-3xl overflow-hidden border border-black/5 shadow-inner">
        <img 
          src="https://picsum.photos/seed/map/800/600" 
          alt="Map" 
          className="w-full h-full object-cover opacity-60 grayscale"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
              <Navigation size={24} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600/20 rounded-full blur-sm" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Navigation size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ETA</p>
              <p className="text-sm font-bold text-slate-900">8 mins (2.4 km)</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200">
            Open Maps
          </button>
        </div>
      </div>

      {/* Step Info Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeStep === 'pickup' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
            {activeStep === 'pickup' ? <Package size={24} /> : <MapPin size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              {activeStep === 'pickup' ? 'City Health Pharmacy' : 'Jane Smith'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeStep === 'pickup' ? 'Satellite, Ahmedabad' : 'Vastrapur, Ahmedabad'}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Items</span>
            <span className="font-bold text-slate-900">3 Medicines</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Payment</span>
            <span className="font-bold text-emerald-600">Prepaid</span>
          </div>
          {activeStep === 'delivery' && (
            <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-2 text-blue-700 text-xs font-medium">
              <ShieldCheck size={16} />
              Prescription verified by pharmacist
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowProofModal(true)}
            className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Camera size={20} />
            {proofImage ? 'Proof Added' : 'Add Proof'}
          </button>
          <button 
            onClick={() => setShowOtpModal(true)}
            className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-slate-200"
          >
            {activeStep === 'pickup' ? 'Confirm Pickup' : 'Complete Delivery'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 sm:pb-8"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Enter Verification OTP</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Ask the {activeStep === 'pickup' ? 'seller' : 'customer'} for the 4-digit code
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <input 
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-14 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-bold focus:border-blue-600 focus:bg-white outline-none transition-all"
                    value={otpValue[i-1] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newOtp = otpValue.split('');
                        newOtp[i-1] = val;
                        setOtpValue(newOtp.join(''));
                      }
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleVerifyOtp}
                disabled={otpValue.length < 4 || isVerifying}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${otpValue.length === 4 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-400'}`}
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify & Proceed'
                )}
              </button>
              
              <button 
                onClick={() => setShowOtpModal(false)}
                className="w-full py-4 text-slate-400 font-bold mt-2"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Modal (Simplified) */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed inset-0 bg-white z-[60] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChat(false)} className="p-2 text-slate-600">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="font-bold text-slate-900">Jane Smith</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Customer</p>
                </div>
              </div>
              <button className="p-2 text-blue-600 bg-blue-50 rounded-xl">
                <Phone size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
              {MOCK_CHATS.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === 'delivery-1' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.senderId === 'delivery-1' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none shadow-sm'}`}>
                    {msg.message}
                    <p className={`text-[10px] mt-1 ${msg.senderId === 'delivery-1' ? 'text-white/50' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900"
              />
              <button className="bg-slate-900 text-white p-3 rounded-xl">
                <Navigation size={20} className="rotate-45" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Proof Modal */}
      <AnimatePresence>
        {showProofModal && (
          <div className="fixed inset-0 bg-slate-900/90 z-[70] flex flex-col items-center justify-center p-6 text-white">
            <div className="w-full aspect-[3/4] bg-slate-800 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center mb-8 relative overflow-hidden">
              {proofImage ? (
                <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={48} className="text-white/20 mb-4" />
                  <p className="text-sm font-bold text-white/50">Capture Proof of {activeStep === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                </>
              )}
            </div>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowProofModal(false)}
                className="flex-1 py-4 font-bold text-white/50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCaptureProof}
                className="flex-[2] bg-white text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Capture Photo
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyDeliveries;
