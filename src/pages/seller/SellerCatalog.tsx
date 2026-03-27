import React, { useEffect, useState } from 'react';
import { Search, Eye, EyeOff, Star, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { logEvent } from '../../utils/logger';

const SellerCatalog: React.FC = () => {
  const { profile } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    logEvent('SELLER.CATALOG.LOAD.START', { userId: profile?.uid });
    if (!profile?.uid) return;
    const pharmacies = await api.getPharmacies({ ownerId: profile.uid });
    const pharmacy = pharmacies[0];
    if (!pharmacy) {
      logEvent('UI.STATE', { condition: 'NO_PHARMACY', reason: 'pharmacy == null', userId: profile.uid });
      setErrorMessage('No pharmacy found');
      setInventory([]);
      return;
    }
    setErrorMessage('');

    const [items, masters] = await Promise.all([
      api.getInventory({ pharmacyId: pharmacy.id }),
      api.getMedicines({ includeAll: 'true' }),
    ]);

    const joinedInventory = items.map((inv: any) => ({
      ...inv,
      masterData: masters.find((m: any) => m.id === inv.medicineMasterId) || null
    }));
    joinedInventory.forEach((item: any) => {
      if (!item.medicineMasterId || !item.masterData) {
        logEvent('DATA.ERROR', { type: 'JOIN_FAILED_MEDICINE_MASTER', item });
      }
    });
    setInventory(joinedInventory);
    logEvent('DATA.EXPECTATION', {
      page: 'Seller Catalog',
      expected: { medicineMasterId: 'string', masterData: 'object' },
      actual: items,
    });
  };

  useEffect(() => {
    logEvent('UI.TAB_LOAD', {
      panel: 'SELLER',
      page: 'Catalog',
      expectedData: ['pharmacy', 'inventory', 'medicineMaster'],
    });
    loadData().catch((e) => setErrorMessage(e?.message || 'Failed to load catalog'));
  }, [profile]);

  const filtered = inventory.filter((item: any) => `${item.masterData?.brandName || ''} ${item.masterData?.genericName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medicine Catalog</h1>
          <p className="text-slate-500 text-sm">Manage your store's medicine listings and pricing</p>
        </div>
        <p className="text-xs text-slate-500">Listings are created from Inventory only.</p>
      </div>

      {errorMessage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium">{errorMessage}</div>}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by brand or generic name..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item: any) => (
          <motion.div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-40 bg-slate-50 p-4 flex items-center justify-center">
              {!item.masterData?.image && logEvent('DATA.WARNING', { type: 'EMPTY_IMAGE', itemId: item.id })}
              <img src={item.masterData?.image || undefined} alt={item.masterData?.brandName} className="max-h-full max-w-full object-contain" />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button onClick={() => api.updateInventory(item.id, { isVisible: !item.isVisible }).then(loadData)} className="p-2 rounded-lg shadow-sm bg-white text-emerald-600">{item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button onClick={() => api.updateInventory(item.id, { isFeatured: !item.isFeatured }).then(loadData)} className="p-2 rounded-lg shadow-sm bg-white text-slate-500"><Star className={`w-4 h-4 ${item.isFeatured ? 'fill-current text-amber-500' : ''}`} /></button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900">{item.masterData?.brandName}</h3>
              <p className="text-xs text-slate-500 italic">{item.masterData?.genericName}</p>
              <div className="flex items-center justify-between text-sm"><span>₹{item.price}</span><span>Stock: {item.stock}</span></div>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"><Edit2 className="w-3.5 h-3.5 inline mr-1" />Edit</button>
                <button onClick={async () => { if (!window.confirm('Delete this listing?')) return; await api.deleteInventory(item.id); await loadData(); }} className="p-2 bg-slate-50 text-red-600 rounded-xl border border-slate-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SellerCatalog;
