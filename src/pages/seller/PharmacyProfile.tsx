import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../services/api';

type AddressForm = {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
};

type PharmacyForm = {
  pharmacyName: string;
  ownerName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: AddressForm;
};

const emptyForm: PharmacyForm = {
  pharmacyName: '',
  ownerName: '',
  licenseNumber: '',
  phone: '',
  email: '',
  gstNumber: '',
  address: {
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  },
};

const requiredKeys: Array<keyof PharmacyForm | `address.${keyof AddressForm}`> = [
  'pharmacyName',
  'ownerName',
  'licenseNumber',
  'phone',
  'email',
  'address.street',
  'address.area',
  'address.city',
  'address.state',
  'address.pincode',
];

const PharmacyProfile: React.FC = () => {
  const { profile } = useAuth();
  const [form, setForm] = useState<PharmacyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!form.pharmacyName.trim()) next.pharmacyName = 'Pharmacy name is required.';
    if (!form.ownerName.trim()) next.ownerName = 'Owner name is required.';
    if (!form.licenseNumber.trim()) next.licenseNumber = 'License number is required.';
    if (!form.phone.trim()) next.phone = 'Phone is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.address.street.trim()) next['address.street'] = 'Street is required.';
    if (!form.address.area.trim()) next['address.area'] = 'Area is required.';
    if (!form.address.city.trim()) next['address.city'] = 'City is required.';
    if (!form.address.state.trim()) next['address.state'] = 'State is required.';
    if (!form.address.pincode.trim()) next['address.pincode'] = 'Pincode is required.';
    return next;
  };

  const loadPharmacy = async () => {
    if (!profile?.uid) return;
    setLoading(true);
    setError('');
    try {
      const pharmacies = await api.getPharmacies({ ownerId: profile.uid });
      const existing = pharmacies[0];
      if (!existing) {
        setForm({
          ...emptyForm,
          ownerName: profile.displayName || '',
          email: profile.email || '',
        });
        return;
      }
      setForm({
        pharmacyName: existing.pharmacyName || existing.name || '',
        ownerName: existing.ownerName || '',
        licenseNumber: existing.licenseNumber || '',
        phone: existing.phone || existing.contactNumber || '',
        email: existing.email || profile.email || '',
        gstNumber: existing.gstNumber || '',
        address: {
          street: existing.address?.street || '',
          area: existing.address?.area || '',
          city: existing.address?.city || '',
          state: existing.address?.state || '',
          pincode: existing.address?.pincode || '',
        },
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to load pharmacy profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacy();
  }, [profile?.uid]);

  const updateField = (key: keyof PharmacyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const updateAddressField = (key: keyof AddressForm, value: string) => {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    setFieldErrors((prev) => ({ ...prev, [`address.${key}`]: '' }));
  };

  const completeness = useMemo(() => {
    return requiredKeys.every((entry) => {
      if (entry.startsWith('address.')) {
        const key = entry.replace('address.', '') as keyof AddressForm;
        return form.address[key].trim().length > 0;
      }
      return String(form[entry as keyof PharmacyForm] || '').trim().length > 0;
    });
  }, [form]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;

    setSuccess('');
    setError('');

    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError('Please complete all required fields before saving.');
      return;
    }

    setSaving(true);
    try {
      await api.createPharmacy({
        id: profile.uid,
        ownerId: profile.uid,
        sellerId: profile.uid,
        name: form.pharmacyName,
        pharmacyName: form.pharmacyName,
        ownerName: form.ownerName,
        licenseNumber: form.licenseNumber,
        address: form.address,
        phone: form.phone,
        contactNumber: form.phone,
        email: form.email,
        gstNumber: form.gstNumber,
        status: 'pending',
        verificationStatus: 'pending',
      });

      const verifyRows = await api.getPharmacies({ ownerId: profile.uid });
      const verified = verifyRows[0] || {};
      const actual = {
        pharmacyName: verified.pharmacyName || verified.name,
        ownerName: verified.ownerName,
        licenseNumber: verified.licenseNumber,
        address: verified.address,
        phone: verified.phone || verified.contactNumber,
        email: verified.email,
        gstNumber: verified.gstNumber,
      };

      console.group('[PROFILE_SAVE][VERIFY]');
      console.log('EXPECTED_FIELDS:', requiredKeys);
      console.log('ACTUAL_FIELDS:', actual);
      console.groupEnd();

      setSuccess('Profile saved successfully.');
      await loadPharmacy();
    } catch (err: any) {
      console.group('[PROFILE_SAVE][FAIL]');
      console.error('DETAIL:', err);
      console.groupEnd();
      setError(err?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Store Profile</h1>
        <p className="text-slate-500">Complete your pharmacy profile to unlock seller operations.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <form onSubmit={onSave} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pharmacy Name *</label>
              <input value={form.pharmacyName} onChange={(e) => updateField('pharmacyName', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              {fieldErrors.pharmacyName && <p className="text-xs text-red-600 mt-1">{fieldErrors.pharmacyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Owner Name *</label>
              <input value={form.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              {fieldErrors.ownerName && <p className="text-xs text-red-600 mt-1">{fieldErrors.ownerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Number *</label>
              <input value={form.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              {fieldErrors.licenseNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.licenseNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GST Number (optional)</label>
              <input value={form.gstNumber} onChange={(e) => updateField('gstNumber', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Street *</label>
                <input value={form.address.street} onChange={(e) => updateAddressField('street', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                {fieldErrors['address.street'] && <p className="text-xs text-red-600 mt-1">{fieldErrors['address.street']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Area *</label>
                <input value={form.address.area} onChange={(e) => updateAddressField('area', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                {fieldErrors['address.area'] && <p className="text-xs text-red-600 mt-1">{fieldErrors['address.area']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                <input value={form.address.city} onChange={(e) => updateAddressField('city', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                {fieldErrors['address.city'] && <p className="text-xs text-red-600 mt-1">{fieldErrors['address.city']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <input value={form.address.state} onChange={(e) => updateAddressField('state', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                {fieldErrors['address.state'] && <p className="text-xs text-red-600 mt-1">{fieldErrors['address.state']}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
                <input value={form.address.pincode} onChange={(e) => updateAddressField('pincode', e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                {fieldErrors['address.pincode'] && <p className="text-xs text-red-600 mt-1">{fieldErrors['address.pincode']}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <p className={`text-sm ${completeness ? 'text-emerald-700' : 'text-amber-700'}`}>
              {completeness ? 'Profile is complete.' : 'Complete all required fields to continue.'}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PharmacyProfile;
