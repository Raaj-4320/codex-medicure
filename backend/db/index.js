import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to db.json in the root directory
const dbPath = path.join(__dirname, '../../db.json');

const now = new Date().toISOString();

const defaultData = {
  users: [
    { id: 'admin-1', uid: 'admin-1', email: 'admin123@gmail.com', displayName: 'System Admin', role: 'admin', status: 'active', addresses: [], createdAt: now },
    { id: 'seller-1', uid: 'seller-1', email: 'seller123@gmail.com', displayName: 'Main Seller', role: 'seller', status: 'active', addresses: [], createdAt: now },
    { id: 'customer-1', uid: 'customer-1', email: 'customer1@gmail.com', displayName: 'Customer 1', role: 'customer', status: 'active', addresses: [], createdAt: now },
    { id: 'delivery-1', uid: 'delivery-1', email: 'del1@gmail.com', displayName: 'John Delivery', role: 'delivery', status: 'active', addresses: [], createdAt: now },
  ],
  pharmacies: [
    {
      id: 'pharmacy-1',
      sellerId: 'seller-1',
      name: 'City Health Pharmacy',
      description: 'Trusted neighborhood pharmacy',
      image: 'https://picsum.photos/seed/pharm1/400/300',
      address: { city: 'Ahmedabad', area: 'Satellite', pincode: '380015', state: 'Gujarat' },
      contactNumber: '+91 9000000000',
      operatingHours: '8 AM - 10 PM',
      deliveryAvailable: true,
      pickupAvailable: true,
      minOrderValue: 100,
      deliveryFee: 40,
      rating: 4.5,
      reviewCount: 120,
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
    { id: 'inv-1', pharmacyId: 'pharmacy-1', name: 'Dolo 650', medicineMasterId: 'med-1', price: 30, discountPrice: 28, stock: 500, isVisible: true, isFeatured: true, createdAt: now, updatedAt: now },
    { id: 'inv-2', pharmacyId: 'pharmacy-1', name: 'Augmentin 625 Duo', medicineMasterId: 'med-2', price: 150, discountPrice: 140, stock: 45, isVisible: true, isFeatured: false, createdAt: now, updatedAt: now },
  ],
  orders: [
    { id: 'order-1', customerId: 'customer-1', userId: 'customer-1', pharmacyId: 'pharmacy-1', items: [{ medicineId: 'med-1', quantity: 2, price: 30 }], totalAmount: 1200, status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: now },
    { id: 'order-2', customerId: 'customer-1', userId: 'customer-1', pharmacyId: 'pharmacy-1', items: [{ medicineId: 'med-2', quantity: 1, price: 140 }], totalAmount: 850, status: 'delivered', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: now },
  ],
  deliveryAssignments: [
    { id: 'assign-1', orderId: 'order-1', deliveryStaffId: 'delivery-1', status: 'assigned', assignedAt: now, pickupOtp: '4561', deliveryOtp: '7892' }
  ],
  payments: [],
  notifications: [
    { id: 'not-1', userId: 'seller-1', title: 'New Order Received', message: 'You have a new order #order-1 from Customer 1', type: 'order', isRead: false, createdAt: now },
  ],
  prescriptions: [
    { id: 'RX-001', userId: 'customer-1', pharmacyId: 'pharmacy-1', status: 'pending', imageUrl: 'https://picsum.photos/seed/rx/600/400', createdAt: now }
  ],
  returns: [
    { id: 'RET-001', orderId: 'order-2', customerId: 'customer-1', pharmacyId: 'pharmacy-1', reason: 'wrong_item', description: 'Wrong medicine delivered', status: 'pending', items: [{ medicineName: 'Augmentin 625 Duo', quantity: 1 }], createdAt: now }
  ],
  tickets: [
    { id: 'TKT-001', userId: 'seller-1', subject: 'Payout delay', description: 'Settlement pending from last week', category: 'payout', status: 'open', priority: 'medium', createdAt: now, updatedAt: now }
  ],
  complianceDocuments: [
    { id: 'CMP-001', sellerId: 'seller-1', type: 'license', documentUrl: 'https://example.com/license.pdf', status: 'pending', createdAt: now, updatedAt: now }
  ],
  payouts: [
    { id: 'PYO-001', sellerId: 'seller-1', pharmacyId: 'pharmacy-1', amount: 10000, commission: 1000, gst: 1800, netAmount: 7200, status: 'pending', periodStart: '2026-03-01', periodEnd: '2026-03-07', createdAt: now }
  ]
};

export const getDb = async () => {
  return await JSONFilePreset(dbPath, defaultData);
};
