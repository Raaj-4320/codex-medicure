import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { logFlow } from './flowLogger';

type SeedMedicine = {
  id: string;
  brandName: string;
  genericName: string;
  category: string;
  manufacturer: string;
  rxRequired: boolean;
  schedule: string;
};

const seedMedicines: SeedMedicine[] = [
  { id: 'mm-paracetamol-650', brandName: 'Paracetamol 650', genericName: 'Paracetamol', category: 'Analgesic', manufacturer: 'MediCare Labs', rxRequired: false, schedule: 'None' },
  { id: 'mm-amoxicillin-500', brandName: 'Amoxicillin 500', genericName: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'BioPharm', rxRequired: true, schedule: 'Schedule H' },
  { id: 'mm-cetirizine-10', brandName: 'Cetirizine 10', genericName: 'Cetirizine', category: 'Allergy', manufacturer: 'AllerGen', rxRequired: false, schedule: 'None' },
  { id: 'mm-metformin-500', brandName: 'Metformin 500', genericName: 'Metformin', category: 'Diabetes', manufacturer: 'Gluco Health', rxRequired: true, schedule: 'Schedule H' },
  { id: 'mm-atorvastatin-10', brandName: 'Atorvastatin 10', genericName: 'Atorvastatin', category: 'Cardiac', manufacturer: 'CardioLife', rxRequired: true, schedule: 'Schedule H' },
];

const hasData = async (collectionName: string): Promise<boolean> => {
  const snap = await getDocs(query(collection(db, collectionName), limit(1)));
  return !snap.empty;
};

export const ensureSeedData = async (): Promise<void> => {
  try {
    const hasMedicineMaster = await hasData('medicine_master');
    if (!hasMedicineMaster) {
      console.log('[SEED] inserting medicine_master');
      for (const medicine of seedMedicines) {
        await setDoc(doc(db, 'medicine_master', medicine.id), {
          ...medicine,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const hasPharmacies = await hasData('pharmacies');
    if (!hasPharmacies) {
      await setDoc(doc(db, 'pharmacies', 'seed-pharmacy-1'), {
        id: 'seed-pharmacy-1',
        ownerId: 'seed-seller-1',
        sellerId: 'seed-seller-1',
        name: 'Seed Verified Pharmacy',
        description: 'Seed pharmacy',
        address: { city: 'Ahmedabad', state: 'Gujarat' },
        contactNumber: '9999999999',
        email: 'seedpharmacy@example.com',
        operatingHours: '09:00-21:00',
        status: 'verified',
        verificationStatus: 'verified',
        deliveryAvailable: true,
        pickupAvailable: true,
        minOrderValue: 100,
        deliveryFee: 30,
        rating: 4.6,
        reviewCount: 12,
        image: '',
        createdAt: new Date().toISOString(),
      });
    }

    const hasInventory = await hasData('inventory');
    if (!hasInventory) {
      const items = [
        { pharmacyId: 'seed-pharmacy-1', medicineMasterId: 'mm-paracetamol-650', price: 45, stock: 120 },
        { pharmacyId: 'seed-pharmacy-1', medicineMasterId: 'mm-cetirizine-10', price: 30, stock: 80 },
      ];
      for (const item of items) {
        await addDoc(collection(db, 'inventory'), { ...item, isVisible: true, isFeatured: false, createdAt: new Date().toISOString() });
      }
    }

    const hasOrders = await hasData('orders');
    if (!hasOrders) {
      const orders = [
        { customerId: 'seed-customer-1', pharmacyId: 'seed-pharmacy-1', status: 'pending', totalAmount: 180 },
        { customerId: 'seed-customer-2', pharmacyId: 'seed-pharmacy-1', status: 'delivered', totalAmount: 350 },
      ];
      for (const order of orders) {
        await addDoc(collection(db, 'orders'), { ...order, orderType: 'delivery', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deliveryAddress: {} });
      }
    }

    const hasNotifications = await hasData('notifications');
    if (!hasNotifications) {
      const notifications = [
        { userId: 'seed-seller-1', title: 'Welcome', message: 'Your pharmacy is active', type: 'system' },
        { userId: 'seed-seller-1', title: 'Inventory Tip', message: 'Add featured medicines', type: 'stock' },
      ];
      for (const notification of notifications) {
        await addDoc(collection(db, 'notifications'), { ...notification, isRead: false, createdAt: new Date().toISOString() });
      }
    }

    const inventorySnap = await getDocs(collection(db, 'inventory'));
    for (const inventoryDoc of inventorySnap.docs) {
      const data = inventoryDoc.data();
      if (!data.medicineMasterId) {
        await deleteDoc(doc(db, 'inventory', inventoryDoc.id));
      }
    }

    const pharmacySnap = await getDocs(collection(db, 'pharmacies'));
    for (const pharmacyDoc of pharmacySnap.docs) {
      const data = pharmacyDoc.data();
      if (!data.ownerId || !data.sellerId) {
        await deleteDoc(doc(db, 'pharmacies', pharmacyDoc.id));
      }
    }

    logFlow('SEED_DATA', {
      expected: ['seeded required collections when empty', 'cleaned invalid records'],
      received: {
        medicineMasterSeeded: !hasMedicineMaster,
        pharmaciesSeeded: !hasPharmacies,
        inventorySeeded: !hasInventory,
        ordersSeeded: !hasOrders,
        notificationsSeeded: !hasNotifications,
      },
      success: true,
    });
  } catch (error) {
    logFlow('SEED_DATA', {
      expected: ['seed/cleanup execution'],
      received: null,
      success: false,
      error,
    });
  }
};

export default ensureSeedData;
