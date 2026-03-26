import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, ShoppingBag, Activity, Loader2, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../AuthContext';
import { api } from '../../services/api';

const SellerAnalytics: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!profile?.uid) return;
      setLoading(true);
      setError('');
      try {
        const analytics = await api.getAnalytics({ sellerId: profile.uid });
        setData(analytics);
      } catch (err: any) {
        setError(err?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profile]);

  const monthlySales = useMemo(() => data?.monthlySales || [], [data]);
  const topMedicines = useMemo(() => data?.topMedicines || [], [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
        <p className="text-slate-500 text-sm">Real-time performance metrics from your backend data</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={data?.totalOrders ?? 0} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Completed Orders" value={data?.completedOrders ?? 0} />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Revenue" value={`₹${Number(data?.totalRevenue || 0).toFixed(2)}`} />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Avg Order Value" value={`₹${Number(data?.averageOrderValue || 0).toFixed(2)}`} />
      </div>

      {(!monthlySales.length && !topMedicines.length) ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
          <p className="text-slate-600 font-medium">No analytics data available yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Monthly Sales</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Top Medicines</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMedicines}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="totalSold" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {topMedicines.map((m: any) => (
                  <div key={m.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{m.name}</span>
                    <span className="font-bold text-slate-900">{m.totalSold}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-700">Pending Orders: <span className="font-bold">{data?.pendingOrders ?? 0}</span></p>
            <p className="text-sm text-slate-700">Total Payouts: <span className="font-bold">₹{Number(data?.totalPayouts || 0).toFixed(2)}</span></p>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 rounded-lg bg-slate-100 text-slate-700">{icon}</div>
    </div>
    <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="text-xl font-bold text-slate-900">{value}</p>
  </div>
);

export default SellerAnalytics;
