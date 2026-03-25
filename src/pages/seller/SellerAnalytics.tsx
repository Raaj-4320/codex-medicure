import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  Download, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Activity
} from 'lucide-react';
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
  PieChart, 
  Cell, 
  Pie 
} from 'recharts';
import { motion } from 'motion/react';

const SellerAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const revenueData = [
    { name: 'Week 1', revenue: 45000, orders: 120 },
    { name: 'Week 2', revenue: 52000, orders: 145 },
    { name: 'Week 3', revenue: 48000, orders: 132 },
    { name: 'Week 4', revenue: 61000, orders: 168 },
  ];

  const categoryData = [
    { name: 'Prescription', value: 45, color: '#10b981' },
    { name: 'OTC', value: 30, color: '#3b82f6' },
    { name: 'Personal Care', value: 15, color: '#f59e0b' },
    { name: 'Devices', value: 10, color: '#ef4444' },
  ];

  const topMedicines = [
    { name: 'Paracetamol 500mg', sales: 450, growth: '+12%', revenue: '₹12,450' },
    { name: 'Amoxicillin 250mg', sales: 320, growth: '+8%', revenue: '₹45,600' },
    { name: 'Metformin 500mg', sales: 280, growth: '-3%', revenue: '₹18,200' },
    { name: 'Vitamin D3 60K', sales: 210, growth: '+25%', revenue: '₹32,400' },
    { name: 'Cetirizine 10mg', sales: 190, growth: '+5%', revenue: '₹8,500' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '₹2,06,000', change: '+15.4%', positive: true, icon: TrendingUp, color: 'emerald' },
    { label: 'Total Orders', value: '565', change: '+12.2%', positive: true, icon: ShoppingBag, color: 'blue' },
    { label: 'Avg. Order Value', value: '₹364', change: '-2.1%', positive: false, icon: Activity, color: 'amber' },
    { label: 'Order Completion', value: '98.2%', change: '+0.5%', positive: true, icon: CheckCircle2, color: 'indigo' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-slate-500 text-sm">Deep dive into your store's performance and growth</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button 
                key={range} 
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Revenue & Orders Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-8">Sales by Category</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">100%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sales</span>
              </div>
            </div>
            <div className="w-full mt-8 space-y-3">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Medicines */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Top Performing Medicines</h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {topMedicines.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{med.name}</p>
                    <p className="text-xs text-slate-500">{med.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{med.revenue}</p>
                  <p className={`text-[10px] font-bold ${med.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {med.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-8">Operational Efficiency</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="p-2 bg-white rounded-xl w-fit shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg. Order Processing</p>
                <h4 className="text-2xl font-bold text-slate-900">14m 22s</h4>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <ArrowDownRight className="w-3 h-3" />
                -2m vs last week
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="p-2 bg-white rounded-xl w-fit shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Order Cancellation Rate</p>
                <h4 className="text-2xl font-bold text-slate-900">1.2%</h4>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <ArrowDownRight className="w-3 h-3" />
                -0.4% vs last week
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="p-2 bg-white rounded-xl w-fit shadow-sm">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Customer Retention</p>
                <h4 className="text-2xl font-bold text-slate-900">42%</h4>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                +5% vs last month
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="p-2 bg-white rounded-xl w-fit shadow-sm">
                <PieChartIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Inventory Turnover</p>
                <h4 className="text-2xl font-bold text-slate-900">4.5x</h4>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                +0.2x vs last month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
