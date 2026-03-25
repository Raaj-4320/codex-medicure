import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  Image as ImageIcon,
  DollarSign,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SellerMedicine, MedicineMaster } from '../../types';
import { MOCK_SELLER_INVENTORY, MOCK_MEDICINE_CATALOG } from '../../staticData';

const SellerCatalog: React.FC = () => {
  const [inventory, setInventory] = useState<SellerMedicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'hidden' | 'featured'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<SellerMedicine | null>(null);

  useEffect(() => {
    // Join mock data
    const joinedData = MOCK_SELLER_INVENTORY.map(inv => ({
      ...inv,
      masterData: MOCK_MEDICINE_CATALOG.find(m => m.id === inv.medicineMasterId)
    })) as SellerMedicine[];
    setInventory(joinedData);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && item.isVisible) || 
                         (filter === 'hidden' && !item.isVisible) || 
                         (filter === 'featured' && item.isFeatured);
    const matchesSearch = item.masterData?.brandName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.masterData?.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleVisibility = (id: string) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  const toggleFeatured = (id: string) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medicine Catalog</h1>
          <p className="text-slate-500 text-sm">Manage your store's medicine listings and pricing</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 rounded-2xl text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by brand or generic name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {(['all', 'active', 'hidden', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <motion.div
            layout
            key={item.id}
            className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md ${!item.isVisible ? 'opacity-75' : ''}`}
          >
            <div className="relative h-40 bg-slate-50 p-4 flex items-center justify-center">
              <img src={item.masterData?.image} alt={item.masterData?.brandName} className="max-h-full max-w-full object-contain mix-blend-multiply" />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button 
                  onClick={() => toggleVisibility(item.id)}
                  className={`p-2 rounded-lg shadow-sm transition-colors ${item.isVisible ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-slate-900 text-white'}`}
                >
                  {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => toggleFeatured(item.id)}
                  className={`p-2 rounded-lg shadow-sm transition-colors ${item.isFeatured ? 'bg-amber-500 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                >
                  <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-current' : ''}`} />
                </button>
              </div>
              {item.masterData?.rxRequired && (
                <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100 uppercase">
                  Rx Required
                </div>
              )}
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.masterData?.category}</p>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    item.masterData?.schedule === 'Schedule H' ? 'bg-amber-50 text-amber-600' :
                    item.masterData?.schedule === 'Schedule X' ? 'bg-red-50 text-red-600' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {item.masterData?.schedule}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 leading-tight">{item.masterData?.brandName}</h3>
                <p className="text-xs text-slate-500 mt-1 italic">{item.masterData?.genericName}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-slate-900">₹{item.discountPrice || item.price}</span>
                    {item.discountPrice && <span className="text-[10px] text-slate-400 line-through">₹{item.price}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Stock</p>
                  <p className={`text-sm font-bold ${item.stock < 50 ? 'text-red-600' : 'text-slate-900'}`}>{item.stock}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button className="p-2 bg-slate-50 text-red-600 rounded-xl hover:bg-red-50 transition-colors border border-slate-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal (Placeholder) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Medicine to Catalog</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Select Medicine</label>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm">
                      <option>Search from Master Catalog...</option>
                      {MOCK_MEDICINE_CATALOG.map(m => (
                        <option key={m.id} value={m.id}>{m.brandName} ({m.genericName})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">MRP (₹)</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Selling Price (₹)</label>
                    <input type="number" placeholder="0.00" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Initial Stock</label>
                    <input type="number" placeholder="0" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    By adding this medicine, you confirm that you have a valid drug license to sell this category and will comply with all regulatory requirements.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                  Save Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerCatalog;
