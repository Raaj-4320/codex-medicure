import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Wallet,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  MOCK_DELIVERY_WALLET, 
  MOCK_DELIVERY_TRANSACTIONS, 
  MOCK_DELIVERY_PERFORMANCE 
} from '../../staticData';
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
import { motion } from 'motion/react';

const Earnings: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const chartData = [
    { name: 'Mon', amount: 450 },
    { name: 'Tue', amount: 520 },
    { name: 'Wed', amount: 380 },
    { name: 'Thu', amount: 610 },
    { name: 'Fri', amount: 750 },
    { name: 'Sat', amount: 920 },
    { name: 'Sun', amount: 840 },
  ];

  const performance = MOCK_DELIVERY_PERFORMANCE;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Earnings</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['daily', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Earnings Card */}
      <div className="bg-slate-900 text-white p-6 rounded-[40px] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Total Earnings</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight">₹{MOCK_DELIVERY_WALLET.totalEarnings.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <TrendingUp size={24} />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">This Week</p>
              <p className="text-lg font-bold">₹4,470</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                <ArrowUpRight size={10} /> +12%
              </div>
            </div>
            <div className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/10">
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Avg / Order</p>
              <p className="text-lg font-bold">₹52</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                <ArrowUpRight size={10} /> +5%
              </div>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900">Revenue Trend</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar size={14} />
            <span>Mar 12 - Mar 19</span>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                dy={10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Success Rate</p>
          <div className="text-xl font-bold text-slate-900 mt-1">{performance.successRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${performance.successRate}%` }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">On-Time %</p>
          <div className="text-xl font-bold text-slate-900 mt-1">{performance.onTimeRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${performance.onTimeRate}%` }} />
          </div>
        </div>
      </div>

      {/* Recent Earnings List */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4">Recent Payouts</h3>
        <div className="space-y-3">
          {MOCK_DELIVERY_TRANSACTIONS.filter(t => t.type === 'earning').map((txn) => (
            <div key={txn.id} className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{txn.description}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(txn.createdAt).toLocaleDateString()} • {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600">+₹{txn.amount}</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">Completed</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
