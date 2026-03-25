import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Factory,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { MOCK_MEDICINE_CATALOG } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const MedicineMasterCatalog: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dosageFilter, setDosageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    brandName: '',
    genericName: '',
    category: 'Analgesics',
    dosageForm: 'Tablet',
    strength: '',
    manufacturer: '',
    rxRequired: false,
    description: ''
  });
  const [saving, setSaving] = useState(false);

  const categories = ['Analgesics', 'Antibiotics', 'Antivirals', 'Cardiovascular', 'Dermatological', 'Gastrointestinal', 'Respiratory', 'Neurological'];
  const dosageForms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setMedicines(MOCK_MEDICINE_CATALOG);
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this medicine from the master catalog?')) return;
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedMeds.length} medicines?`)) return;
    setMedicines(medicines.filter(m => !selectedMeds.includes(m.id)));
    setSelectedMeds([]);
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API delay
    setTimeout(() => {
      const medId = editingMed ? editingMed.id : `med-master-${Date.now()}`;
      const medData = {
        ...formData,
        id: medId,
        image: editingMed?.image || `https://picsum.photos/seed/med${medId}/200/200`
      };

      if (editingMed) {
        setMedicines(medicines.map(m => m.id === medId ? medData : m));
      } else {
        setMedicines([medData, ...medicines]);
      }
      
      setShowAddModal(false);
      setEditingMed(null);
      resetForm();
      setSaving(false);
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      brandName: '',
      genericName: '',
      category: 'Analgesics',
      dosageForm: 'Tablet',
      strength: '',
      manufacturer: '',
      rxRequired: false,
      description: ''
    });
  };

  const openEditModal = (med: any) => {
    setEditingMed(med);
    setFormData({
      brandName: med.brandName,
      genericName: med.genericName,
      category: med.category,
      dosageForm: med.dosageForm,
      strength: med.strength,
      manufacturer: med.manufacturer,
      rxRequired: med.rxRequired,
      description: med.description
    });
    setShowAddModal(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedMeds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMeds.length === paginatedMedicines.length) {
      setSelectedMeds([]);
    } else {
      setSelectedMeds(paginatedMedicines.map(m => m.id));
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = 
      med.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || med.category === categoryFilter;
    const matchesDosage = dosageFilter === 'all' || med.dosageForm === dosageFilter;
    return matchesSearch && matchesCategory && matchesDosage;
  });

  const paginatedMedicines = filteredMedicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  const exportCatalog = () => {
    const csv = [
      ['Brand Name', 'Generic Name', 'Category', 'Dosage Form', 'Strength', 'Manufacturer', 'Rx Required'],
      ...filteredMedicines.map(m => [
        m.brandName,
        m.genericName,
        m.category,
        m.dosageForm,
        m.strength,
        m.manufacturer,
        m.rxRequired ? 'Yes' : 'No'
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'medicine_catalog.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medicine Master Catalog</h1>
          <p className="text-slate-500 text-sm">Global database of approved medicines and formulations</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedMeds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedMeds.length})
            </button>
          )}
          <button 
            onClick={exportCatalog}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setEditingMed(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Formulations</p>
          <h3 className="text-2xl font-bold text-slate-900">{medicines.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Categories</p>
          <h3 className="text-2xl font-bold text-slate-900">{categories.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Rx Required</p>
          <h3 className="text-2xl font-bold text-slate-900">{medicines.filter(m => m.rxRequired).length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Manufacturers</p>
          <h3 className="text-2xl font-bold text-slate-900">12+</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by brand or generic name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
            value={dosageFilter}
            onChange={(e) => setDosageFilter(e.target.value)}
          >
            <option value="all">All Dosages</option>
            {dosageForms.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={selectedMeds.length === paginatedMedicines.length && paginatedMedicines.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-semibold">Medicine Info</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Dosage & Strength</th>
                <th className="px-6 py-4 font-semibold">Manufacturer</th>
                <th className="px-6 py-4 font-semibold">Rx</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                    <p className="text-slate-500">Loading catalog...</p>
                  </td>
                </tr>
              ) : paginatedMedicines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No medicines found in the catalog.
                  </td>
                </tr>
              ) : (
                paginatedMedicines.map((med) => (
                  <tr key={med.id} className={`hover:bg-slate-50 transition-colors group ${selectedMeds.includes(med.id) ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={selectedMeds.includes(med.id)}
                        onChange={() => toggleSelect(med.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden">
                          {med.image ? (
                            <img src={med.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{med.brandName}</p>
                          <p className="text-xs text-slate-500 italic">{med.genericName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {med.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">{med.dosageForm}</p>
                      <p className="text-xs text-slate-500">{med.strength}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Factory className="w-3 h-3 text-slate-400" />
                        {med.manufacturer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {med.rxRequired ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold">Rx</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">OTC</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMedicines.length)} of {filteredMedicines.length} medicines
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal (Simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingMed ? 'Edit Medicine Formulation' : 'Add New Medicine Formulation'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Brand Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. Dolo 650" 
                  value={formData.brandName}
                  onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Generic Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. Paracetamol" 
                  value={formData.genericName}
                  onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Dosage Form</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  value={formData.dosageForm}
                  onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
                >
                  {dosageForms.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Strength</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. 650mg" 
                  value={formData.strength}
                  onChange={(e) => setFormData({...formData, strength: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Manufacturer</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. Micro Labs" 
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="rxRequired"
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  checked={formData.rxRequired}
                  onChange={(e) => setFormData({...formData, rxRequired: e.target.checked})}
                />
                <label htmlFor="rxRequired" className="text-sm font-medium text-slate-700">Prescription (Rx) Required</label>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 min-h-[80px]" 
                  placeholder="Brief description of the medicine..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-white rounded-xl transition-all">Cancel</button>
              <button 
                onClick={handleSave}
                disabled={saving || !formData.brandName || !formData.genericName}
                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingMed ? 'Update Medicine' : 'Save Medicine'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MedicineMasterCatalog;
