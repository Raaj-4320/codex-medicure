import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';

export type AddMedicineValues = {
  medicineMasterId?: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  description: string;
  price: number;
  stock: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddMedicineValues) => Promise<void>;
  defaultValues?: Partial<AddMedicineValues>;
  role: 'admin' | 'seller';
  medicineOptions?: Array<{ id: string; brandName: string; genericName?: string }>;
};

const defaultForm: AddMedicineValues = {
  medicineMasterId: '',
  name: '',
  genericName: '',
  category: 'General',
  dosageForm: 'Tablet',
  strength: '',
  manufacturer: '',
  description: '',
  price: 0,
  stock: 0,
};

const AddMedicineModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, defaultValues, role, medicineOptions = [] }) => {
  const [form, setForm] = useState<AddMedicineValues>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...defaultForm, ...defaultValues, price: Number(defaultValues?.price ?? 0), stock: Number(defaultValues?.stock ?? 0) });
    setError('');
    setSubmitting(false);
  }, [isOpen, defaultValues]);

  if (!isOpen) return null;

  const update = (key: keyof AddMedicineValues, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'seller' && !form.medicineMasterId) {
      setError('Please select a medicine before submitting inventory.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(form);
      setForm(defaultForm);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save medicine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add Medicine</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">{error}</div>}
          {role === 'seller' && (
            <Field label="Medicine">
              <select
                required
                value={form.medicineMasterId || ''}
                onChange={(e) => update('medicineMasterId', e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="">Select medicine</option>
                {medicineOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.brandName} {option.genericName ? `(${option.genericName})` : ''}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Medicine Name"><input required={role === 'admin'} value={form.name} onChange={(e) => update('name', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" disabled={role === 'seller'} /></Field>
            <Field label="Generic Name"><input value={form.genericName} onChange={(e) => update('genericName', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Category"><input value={form.category} onChange={(e) => update('category', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Type"><input value={form.dosageForm} onChange={(e) => update('dosageForm', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Strength"><input value={form.strength} onChange={(e) => update('strength', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Manufacturer"><input value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Price"><input type="number" min={0} step="0.01" required value={form.price} onChange={(e) => update('price', Number(e.target.value))} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
            <Field label="Stock"><input type="number" min={0} required value={form.stock} onChange={(e) => update('stock', Number(e.target.value))} className="px-3 py-2 rounded-xl border border-slate-200" /></Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200" rows={3} /></Field>
          <div className="text-xs text-slate-500">Submitting as: <span className="font-bold uppercase">{role}</span></div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Cancel</button>
            <button disabled={submitting || (role === 'seller' && !form.medicineMasterId)} className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-60 inline-flex items-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
    <span>{label}</span>
    {children}
  </label>
);

export default AddMedicineModal;
