import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MapPin,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MOCK_INVENTORY_ALERTS, MOCK_MEDICINE_CATALOG, MOCK_ORDERS } from '../../staticData';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { logError } from '../../utils/flowLogger';

const SupplyChainAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState(MOCK_INVENTORY_ALERTS);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const demandData = [
    { name: 'Jan', demand: 4000 },
    { name: 'Feb', demand: 3000 },
    { name: 'Mar', demand: 2000 },
    { name: 'Apr', demand: 2780 },
    { name: 'May', demand: 1890 },
    { name: 'Jun', demand: 2390 },
    { name: 'Jul', demand: 3490 },
  ];

  const categoryData = [
    { name: 'Analgesics', stock: 400 },
    { name: 'Antibiotics', stock: 300 },
    { name: 'Cardio', stock: 200 },
    { name: 'Respiratory', stock: 278 },
    { name: 'Gastro', stock: 189 },
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
          <h1 className="text-2xl font-bold text-slate-900">Supply Chain Analytics</h1>
          <p className="text-slate-500 text-sm">Monitor global inventory health and demand trends</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter Region
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Global Stock Health', value: '94.2%', icon: ShieldAlert, color: 'emerald', trend: '+2.1%' },
          { label: 'Active Shortages', value: '12', icon: AlertTriangle, color: 'amber', trend: '-3' },
          { label: 'Avg. Fulfillment Time', value: '4.2h', icon: Clock, color: 'blue', trend: '-15m' },
          { label: 'Regional Demand', value: 'High', icon: TrendingUp, color: 'violet', trend: 'Ahmedabad' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-lg`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-blue-600'} bg-slate-50 px-2 py-1 rounded-full`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecasting Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Demand Forecasting (6 Months)
            </h3>
            <select className="text-xs border-none bg-slate-50 rounded-lg px-2 py-1 focus:ring-0">
              <option>All Categories</option>
              <option>Antibiotics</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            {!chartReady || demandData.length === 0 ? (
              (() => {
                logError('CHART', {
                  type: 'UI',
                  detail: !chartReady ? 'Demand chart skipped: invalid dimensions' : 'Demand chart skipped: no data',
                });
                return <div className="h-full flex items-center justify-center text-slate-500 text-sm">No chart data available.</div>;
              })()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandData}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Critical Stock Alerts
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-slate-50">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{alert.medicineName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.priority === 'critical' ? 'bg-red-100 text-red-700' : 
                    alert.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{alert.pharmacyName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {alert.type === 'low_stock' ? `Qty: ${alert.quantity}` : alert.type === 'expiring_soon' ? `Exp: ${alert.expiryDate}` : 'Out of Stock'}
                  </span>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">Restock</button>
                </div>
              </div>
            ))}
          </div>
          <button className="p-4 text-center text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all border-t border-slate-100">
            View All Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Inventory by Category</h3>
          <div className="h-[250px] w-full">
            {!chartReady || categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No chart data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="stock" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Regional Supply Distribution</h3>
          <div className="space-y-4">
            {[
              { city: 'Ahmedabad', status: 'Optimal', count: 142, color: 'emerald' },
              { city: 'Surat', status: 'Low Stock', count: 89, color: 'orange' },
              { city: 'Vadodara', status: 'Optimal', count: 112, color: 'emerald' },
              { city: 'Rajkot', status: 'Critical', count: 45, color: 'red' },
            ].map((region, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${region.color}-500 shadow-lg shadow-${region.color}-200`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{region.city}</p>
                    <p className="text-[10px] text-slate-500">{region.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{region.count}</p>
                  <p className="text-[10px] text-slate-400">Pharmacies</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainAnalytics;
