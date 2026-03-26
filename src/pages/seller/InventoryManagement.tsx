import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../AuthContext';
import { SellerMedicine } from '../../types';
import AddMedicineModal, { AddMedicineValues } from '../../components/medicine/AddMedicineModal';

const InventoryManagement: React.FC = () => {
  const { profile } = useAuth();
  const [medicines, setMedicines] = useState<SellerMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacyId, setPharmacyId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchInventory = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      const pharmacies = await api.getPharmacies({ sellerId: profile.uid });
      if (pharmacies.length === 0) {
        setErrorMessage('No pharmacy found for this seller account.');
        setMedicines([]);
        return;
      }
      setErrorMessage('');
      const pId = pharmacies[0].id;
      setPharmacyId(pId);

      const inventory = await api.getInventory({ pharmacyId: pId });

      const enriched = await Promise.all(inventory.map(async (item: any) => {
        const masterData = item.medicineMasterId
          ? await api.getMedicines({ id: item.medicineMasterId, includeAll: 'true' })
          : [];
        return {
          ...item,
          masterData: Array.isArray(masterData) ? masterData[0] : masterData
        };
      }));

      setMedicines(enriched);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error fetching inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [profile]);

  const handleAddMedicineRequest = async (values: AddMedicineValues) => {
    if (!profile?.uid) throw new Error('Seller profile not found');
    if (!pharmacyId) throw new Error('No pharmacy found');
    await api.createMedicine({
      ...values,
      pharmacyId,
      sellerId: profile.uid,
      status: 'pending',
    });
    setSuccessMessage('Medicine submitted for admin approval.');
    await fetchInventory();
  };

  const handleEdit = async (item: any) => {
    const stock = Number(window.prompt('Update stock', String(item.stock)) || item.stock);
    const price = Number(window.prompt('Update price', String(item.price)) || item.price);
    try {
      await api.updateInventory(item.id, { stock, price });
      await fetchInventory();
    } catch (error) {
      setErrorMessage('Failed to update inventory item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this inventory item?')) return;
    try {
      await api.deleteInventory(id);
      await fetchInventory();
    } catch (error) {
      setErrorMessage('Failed to delete inventory item');
    }
  };

  const filtered = medicines.filter((m: any) =>
    (m.masterData?.brandName || m.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Manage your medicine stock and pricing</p>
        </div>
        <button
          onClick={() => { setSuccessMessage(''); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {errorMessage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium">{errorMessage}</div>}
      {successMessage && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium">{successMessage}</div>}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Medicine</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{item.masterData?.brandName || item.name}</p>
                    <p className="text-xs text-slate-500">{item.masterData?.genericName || '-'}</p>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{item.masterData?.category || '-'}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${item.stock < 20 ? 'text-red-600' : 'text-slate-900'}`}>{item.stock}</span>
                      {item.stock < 20 && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.isVisible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                      {item.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMedicineModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMedicineRequest}
        role="seller"
      />
    </div>
  );
};

export default InventoryManagement;
