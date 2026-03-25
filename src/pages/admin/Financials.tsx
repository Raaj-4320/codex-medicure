import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Clock,
  Loader2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Download,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { MOCK_FINANCIAL_RECORDS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Financials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'reconciliation'>('overview');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(MOCK_FINANCIAL_RECORDS);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleReconcile = (id: string, status: 'reconciled' | 'failed') => {
    setRecords(records.map(r => r.id === id ? { ...r, status } : r));
  };

  const revenueData = [
    { name: 'Jan', revenue: 45000, commission: 4500 },
    { name: 'Feb', revenue: 52000, commission: 5200 },
    { name: 'Mar', revenue: 48000, commission: 4800 },
    { name: 'Apr', revenue: 61000, commission: 6100 },
    { name: 'May', revenue: 55000, commission: 5500 },
    { name: 'Jun', revenue: 67000, commission: 6700 },
  ];

  const categoryData = [
    { name: 'Antibiotics', value: 35, color: '#10b981' },
    { name: 'Painkillers', value: 25, color: '#3b82f6' },
    { name: 'Vitamins', value: 20, color: '#f59e0b' },
    { name: 'Chronic Care', value: 15, color: '#ef4444' },
    { name: 'Others', value: 5, color: '#6366f1' },
  ];

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
          <h1 className="text-2xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-500 text-sm">Track revenue, manage seller commissions, and handle payouts</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'payouts', label: 'Payouts', icon: DollarSign },
            { id: 'reconciliation', label: 'Reconciliation', icon: CreditCard }
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
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">₹12,45,000</h3>
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
                  </span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Commission</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">₹1,24,500</h3>
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8.2%
                  </span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Payouts</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">₹45,200</h3>
                  <span className="flex items-center text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                    5 Pending
                  </span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">GST Collected</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">₹2,24,100</h3>
                  <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 15%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">Revenue & Commission Trend</h3>
                  <select className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                      <Area type="monotone" dataKey="commission" stroke="#6366f1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Revenue by Category</h3>
                <div className="h-[250px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-slate-600">{cat.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'payouts' && (
          <motion.div
            key="payouts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Seller Payout Records</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Commission</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payout</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">GST</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{record.orderId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.sellerId}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">₹{record.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">₹{record.commissionAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{record.sellerPayout.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">₹{record.gstAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          record.status === 'reconciled' ? 'bg-emerald-100 text-emerald-700' : 
                          record.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'reconciliation' && (
          <motion.div
            key="reconciliation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-900">Pending Reconciliation</h4>
                <p className="text-sm text-orange-700">There are 3 transactions that require manual reconciliation due to payment gateway mismatch.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Manual Reconciliation Queue</h3>
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">System Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Difference</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 't1', gateway: 'Razorpay', sysAmt: 4500, gateAmt: 4450, diff: -50, status: 'pending' },
                      { id: 't2', gateway: 'Stripe', sysAmt: 1200, gateAmt: 1200, diff: 0, status: 'pending' },
                      { id: 't3', gateway: 'Razorpay', sysAmt: 8900, gateAmt: 8950, diff: 50, status: 'pending' }
                    ].map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{tx.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{tx.gateway}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">₹{tx.sysAmt.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">₹{tx.gateAmt.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-sm font-bold ${tx.diff < 0 ? 'text-red-600' : tx.diff > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                          {tx.diff === 0 ? '-' : `₹${Math.abs(tx.diff)}`}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all">
                              Reconcile
                            </button>
                            <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all">
                              Flag
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
      </AnimatePresence>
    </div>
  );
};

export default Financials;
