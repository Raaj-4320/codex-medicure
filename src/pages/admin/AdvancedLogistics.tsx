import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Thermometer, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  FileText,
  Loader2,
  Calendar,
  Navigation,
  Activity,
  Zap,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { MOCK_LOGISTICS_SLA } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const AdvancedLogistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'sla' | 'coldchain'>('tracking');
  const [loading, setLoading] = useState(true);
  const [slaData, setSlaData] = useState(MOCK_LOGISTICS_SLA);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const getSLAStatus = (sla: typeof MOCK_LOGISTICS_SLA[0]) => {
    if (sla.isDelayed) return 'delayed';
    const expected = new Date(sla.expectedDeliveryTime);
    const actual = sla.actualDeliveryTime ? new Date(sla.actualDeliveryTime) : new Date();
    return actual > expected ? 'breached' : 'on-time';
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Advanced Logistics Control</h1>
          <p className="text-slate-500 text-sm">Monitor shipments, track SLAs, and ensure cold-chain integrity</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'tracking', label: 'Live Tracking', icon: Navigation },
            { id: 'sla', label: 'SLA Monitoring', icon: Activity },
            { id: 'coldchain', label: 'Cold Chain', icon: Thermometer }
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
        {activeTab === 'tracking' && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] relative">
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium italic">Interactive Logistics Map View</p>
                    <p className="text-xs text-slate-400">Simulated: Real-time fleet positions would be shown here</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-white/90 backdrop-blur p-3 rounded-xl border border-slate-200 shadow-lg pointer-events-auto">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        42 Active Vehicles
                      </div>
                      <div className="w-px h-4 bg-slate-200" />
                      <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                        <AlertTriangle className="w-3 h-3" />
                        3 Delayed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 px-1">Active Shipments</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {slaData.map((shipment) => (
                    <div key={shipment.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{shipment.orderId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          shipment.isDelayed ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {shipment.isDelayed ? 'Delayed' : 'In Transit'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Partner: {shipment.partnerId}</p>
                          <p className="text-[10px] text-slate-500">Expected: {new Date(shipment.expectedDeliveryTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-orange-500" />
                          Priority: High
                        </div>
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-blue-500" />
                          {shipment.requiresColdChain ? 'Cold Chain' : 'Standard'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sla' && (
          <motion.div
            key="sla"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">SLA Performance Monitoring</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Partner</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expected</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actual</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Delay Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {slaData.map((sla) => {
                    const status = getSLAStatus(sla);
                    return (
                      <tr key={sla.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{sla.orderId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{sla.partnerId}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{new Date(sla.expectedDeliveryTime).toLocaleString()}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{sla.actualDeliveryTime ? new Date(sla.actualDeliveryTime).toLocaleString() : '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            status === 'on-time' ? 'bg-emerald-100 text-emerald-700' : 
                            status === 'delayed' ? 'bg-orange-100 text-orange-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 italic">{sla.delayReason || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'coldchain' && (
          <motion.div
            key="coldchain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {slaData.filter(s => s.requiresColdChain).map((shipment) => (
              <div key={shipment.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{shipment.orderId}</h4>
                      <p className="text-[10px] text-slate-500">Cold Chain Active</p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    shipment.currentTemp && shipment.currentTemp > 8 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {shipment.currentTemp}°C
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Target Range:</span>
                    <span className="font-bold text-slate-700">2°C - 8°C</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Last Ping:</span>
                    <span className="font-bold text-slate-700">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Integrity:</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      <ShieldCheck className="w-3 h-3" /> Secure
                    </span>
                  </div>
                </div>

                <div className="h-16 w-full bg-slate-50 rounded-lg flex items-end gap-1 p-1">
                  {[4, 5, 4.5, 5.2, 4.8, 5.5, 6, 5.8, 5.2, 4.9, 5.1, 4.7].map((val, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-blue-400 rounded-t-sm" 
                      style={{ height: `${(val / 10) * 100}%` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">Temperature Log (Last 12h)</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedLogistics;
