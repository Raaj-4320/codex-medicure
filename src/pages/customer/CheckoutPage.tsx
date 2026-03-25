import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(profile?.addresses?.[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we'd fetch cart from API
    // For now, we'll simulate fetching it
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create Order
      // 1. Process Payment First
      const paymentResponse = await api.processPayment({
        orderId: `temp-${Date.now()}`, // Temporary ID for payment
        amount: total,
        method: paymentMethod
      });

      if (!paymentResponse.success) {
        throw new Error('Payment failed. Please try again.');
      }

      // 2. Create Order
      const orderData = {
        customerId: profile?.uid || 'customer-1',
        pharmacyId: cartItems[0]?.pharmacyId || 'pharmacy-1',
        items: cartItems.map(item => ({
          medicineId: item.medicineId || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        addressId: selectedAddress,
        paymentMethod,
        paymentId: paymentResponse.transactionId,
        prescriptionUrl: prescriptionUploaded ? 'https://example.com/rx.jpg' : null
      };

      const order = await api.createOrder(orderData);
      setOrderId(order.id);

      // 3. Clear Cart
      localStorage.removeItem('cart');
      
      setStep(3); // Success step
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address & Prescription */}
            <div className={`bg-white rounded-2xl p-6 border border-slate-200 ${step > 1 ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold">1</div>
                <h2 className="text-lg font-bold text-slate-900">Delivery & Prescription</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Select Delivery Address</label>
                  <div className="grid grid-cols-1 gap-3">
                    {profile?.addresses?.map((addr: any) => (
                      <label 
                        key={addr.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddress === addr.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="address" 
                          className="mt-1 text-emerald-600 focus:ring-emerald-500"
                          checked={selectedAddress === addr.id}
                          onChange={() => setSelectedAddress(addr.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="font-bold text-slate-900">{addr.type}</span>
                          </div>
                          <p className="text-sm text-slate-600">{addr.addressLine}, {addr.area}, {addr.city}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amber-900 mb-1">Prescription Required</h3>
                      <p className="text-xs text-amber-700 mb-3">Some items in your cart require a valid prescription.</p>
                      <button 
                        onClick={() => setPrescriptionUploaded(true)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          prescriptionUploaded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white text-amber-600 border border-amber-200'
                        }`}
                      >
                        {prescriptionUploaded ? '✓ Prescription Uploaded' : 'Upload Prescription'}
                      </button>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!selectedAddress || !prescriptionUploaded}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white rounded-2xl p-6 border border-slate-200 ${step < 2 ? 'opacity-40' : ''} ${step > 2 ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold">2</div>
                <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
              </div>

              {step >= 2 && (
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="text-emerald-600"
                    />
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-900">Online Payment (UPI/Card)</span>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-emerald-600"
                    />
                    <Truck className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-900">Cash on Delivery</span>
                  </label>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  {step === 2 && (
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${total.toFixed(2)} & Place Order`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-8">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.brandName} x {item.quantity}</span>
                    <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span className="text-emerald-600 font-medium">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-100">
                  <span className="text-slate-900">Total</span>
                  <span className="text-emerald-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h2>
              <p className="text-slate-500 mb-8">Your order <span className="font-bold text-slate-900">#{orderId}</span> has been successfully placed and is being processed.</p>
              <button 
                onClick={() => navigate('/dashboard/orders')}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all"
              >
                Track My Order
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
