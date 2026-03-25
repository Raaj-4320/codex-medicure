import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  ChevronRight, 
  CreditCard, 
  Building,
  History,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { MOCK_DELIVERY_WALLET, MOCK_DELIVERY_TRANSACTIONS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const Wallet: React.FC = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setIsSuccess(false);
        setWithdrawAmount('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">My Wallet</h2>
        <button className="p-2 bg-white rounded-xl border border-black/5 text-slate-600">
          <History size={18} />
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white backdrop-blur-md mb-4 border border-white/20">
            <WalletIcon size={32} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Current Balance</p>
          <h3 className="text-4xl font-bold mt-2 tracking-tight">₹{MOCK_DELIVERY_WALLET.balance.toLocaleString()}</h3>
          
          <div className="flex gap-3 mt-8 w-full">
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-black/20"
            >
              Withdraw
            </button>
            <button className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold border border-white/10 transition-transform active:scale-95">
              Add Money
            </button>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Bank Account Info */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
            <Building size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">HDFC Bank</h4>
            <p className="text-xs text-slate-500 mt-0.5">XXXX XXXX 1234</p>
          </div>
        </div>
        <button className="text-xs font-bold text-blue-600">Change</button>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Transaction History</h3>
          <button className="text-xs font-bold text-slate-400">View All</button>
        </div>
        
        <div className="space-y-3">
          {MOCK_DELIVERY_TRANSACTIONS.map((txn) => (
            <div key={txn.id} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === 'earning' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {txn.type === 'earning' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{txn.description}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(txn.createdAt).toLocaleDateString()} • {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${txn.type === 'earning' ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {txn.type === 'earning' ? '+' : '-'}₹{txn.amount}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${txn.status === 'completed' ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {txn.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 pb-12 sm:pb-8"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden" />
              
              {isSuccess ? (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900">Request Sent!</h3>
                  <p className="text-slate-500 mt-2">Your withdrawal request for ₹{withdrawAmount} is being processed.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-900">Withdraw Money</h3>
                    <p className="text-sm text-slate-500 mt-2">Available balance: ₹{MOCK_DELIVERY_WALLET.balance.toLocaleString()}</p>
                  </div>

                  <div className="relative mb-8">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-5 text-2xl font-bold focus:border-slate-900 focus:bg-white outline-none transition-all"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 mb-8">
                    <AlertCircle className="text-blue-500 shrink-0" size={20} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Withdrawals are processed within 24-48 hours. Minimum withdrawal amount is ₹100.
                    </p>
                  </div>

                  <button 
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) < 100 || isProcessing}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${withdrawAmount && parseFloat(withdrawAmount) >= 100 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Confirm Withdrawal'
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setShowWithdrawModal(false)}
                    className="w-full py-4 text-slate-400 font-bold mt-2"
                  >
                    Cancel
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
