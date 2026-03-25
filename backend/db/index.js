import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to db.json in the root directory
const dbPath = path.join(__dirname, '../../db.json');

const defaultData = { 
  users: [
    { uid: 'admin-1', email: 'admin123@gmail.com', displayName: 'System Admin', role: 'admin', addresses: [], createdAt: new Date().toISOString() },
    { uid: 'seller-1', email: 'seller123@gmail.com', displayName: 'Main Seller', role: 'seller', addresses: [], createdAt: new Date().toISOString() },
    { uid: 'customer-1', email: 'customer1@gmail.com', displayName: 'Customer 1', role: 'customer', addresses: [], createdAt: new Date().toISOString() },
    { uid: 'delivery-1', email: 'del1@gmail.com', displayName: 'John Delivery', role: 'delivery', addresses: [], createdAt: new Date().toISOString() },
  ], 
  pharmacies: [
    { 
      id: 'pharmacy-1', 
      sellerId: 'seller-1', 
      name: 'City Health Pharmacy', 
      image: 'https://picsum.photos/seed/pharm1/400/300',
      address: { city: 'Ahmedabad', area: 'Satellite', pincode: '380015', state: 'Gujarat' },
      verificationStatus: 'verified',
      createdAt: new Date(Date.now() - 1000000000).toISOString(),
      email: 'seller123@gmail.com',
      verificationDetails: {
        ownerName: 'Main Seller',
        licenseNumber: 'GUJ/PHARM/12345',
        licenseExpiry: '2027-12-31',
        documents: [{ type: 'Drug License', url: '#' }, { type: 'GST Certificate', url: '#' }]
      }
    },
  ], 
  medicines: [
    { id: 'med-1', brandName: 'Dolo 650', genericName: 'Paracetamol', category: 'Analgesics', dosageForm: 'Tablet', strength: '650mg', manufacturer: 'Micro Labs', rxRequired: false, schedule: 'None', isRestricted: false, description: 'Used for fever and mild to moderate pain.', image: 'https://picsum.photos/seed/dolo/200/200' },
    { id: 'med-2', brandName: 'Augmentin 625 Duo', genericName: 'Amoxicillin & Potassium Clavulanate', category: 'Antibiotics', dosageForm: 'Tablet', strength: '625mg', manufacturer: 'GSK', rxRequired: true, schedule: 'Schedule H', isRestricted: false, description: 'Broad-spectrum antibiotic for bacterial infections.', image: 'https://picsum.photos/seed/aug/200/200' },
  ], 
  sellerMedicines: [
    { id: 'inv-1', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-1', price: 30, discountPrice: 28, stock: 500, isVisible: true, isFeatured: true },
    { id: 'inv-2', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-2', price: 150, discountPrice: 140, stock: 45, isVisible: true, isFeatured: false },
  ], 
  orders: [
    { id: 'order-1', customerId: 'customer-1', pharmacyId: 'pharmacy-1', totalAmount: 1200, status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'order-2', customerId: 'customer-1', pharmacyId: 'pharmacy-1', totalAmount: 850, status: 'delivered', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ], 
  deliveryAssignments: [
    { id: 'assign-1', orderId: 'order-1', deliveryStaffId: 'delivery-1', status: 'assigned', assignedAt: new Date().toISOString(), pickupOtp: '4561', deliveryOtp: '7892' }
  ], 
  payments: [], 
  notifications: [
    { id: 'not-1', userId: 'seller-1', title: 'New Order Received', message: 'You have a new order #order-4 from Customer 1', type: 'order', isRead: false, createdAt: new Date().toISOString() },
  ] 
};

export const getDb = async () => {
  return await JSONFilePreset(dbPath, defaultData);
};
