import { UserProfile } from './types';

export const STATIC_USERS: Record<string, UserProfile> = {
  'admin123@gmail.com': {
    uid: 'admin-1',
    email: 'admin123@gmail.com',
    displayName: 'System Admin',
    role: 'admin',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
  'seller123@gmail.com': {
    uid: 'seller-1',
    email: 'seller123@gmail.com',
    displayName: 'Main Seller',
    role: 'seller',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
  'customer1@gmail.com': {
    uid: 'customer-1',
    email: 'customer1@gmail.com',
    displayName: 'Customer 1',
    role: 'customer',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
  'del1@gmail.com': {
    uid: 'delivery-1',
    email: 'del1@gmail.com',
    displayName: 'John Delivery',
    role: 'delivery',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
};

export const MOCK_ORDERS = [
  { id: 'order-1', customerId: 'customer-1', pharmacyId: 'pharmacy-1', totalAmount: 1200, status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'order-2', customerId: 'customer-1', pharmacyId: 'pharmacy-1', totalAmount: 850, status: 'delivered', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'order-3', customerId: 'customer-2', pharmacyId: 'pharmacy-1', totalAmount: 2100, status: 'processing', createdAt: new Date(Date.now() - 43200000).toISOString() },
];

export const MOCK_PHARMACIES = [
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
  { 
    id: 'pharmacy-2', 
    sellerId: 'seller-2', 
    name: 'Apex Pharma', 
    image: 'https://picsum.photos/seed/pharm2/400/300',
    address: { city: 'Ahmedabad', area: 'Vastrapur', pincode: '380015', state: 'Gujarat' },
    verificationStatus: 'pending',
    createdAt: new Date(Date.now() - 50000000).toISOString(),
    email: 'apex@example.com',
    verificationDetails: {
      ownerName: 'Rajesh Kumar',
      licenseNumber: 'GUJ/PHARM/99887',
      licenseExpiry: '2026-06-30',
      documents: [{ type: 'Drug License', url: '#' }]
    }
  },
  { 
    id: 'pharmacy-3', 
    sellerId: 'seller-3', 
    name: 'Wellness Medico', 
    image: 'https://picsum.photos/seed/pharm3/400/300',
    address: { city: 'Surat', area: 'Adajan', pincode: '395009', state: 'Gujarat' },
    verificationStatus: 'pending',
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    email: 'wellness@example.com',
    verificationDetails: {
      ownerName: 'Suresh Patel',
      licenseNumber: 'GUJ/PHARM/55443',
      licenseExpiry: '2025-11-20',
      documents: [{ type: 'Drug License', url: '#' }]
    }
  },
];

export const MOCK_MEDICINE_CATALOG = [
  {
    id: 'med-1',
    brandName: 'Dolo 650',
    genericName: 'Paracetamol',
    category: 'Analgesics',
    dosageForm: 'Tablet',
    strength: '650mg',
    manufacturer: 'Micro Labs',
    rxRequired: false,
    schedule: 'None',
    isRestricted: false,
    description: 'Used for fever and mild to moderate pain.',
    image: 'https://picsum.photos/seed/dolo/200/200'
  },
  {
    id: 'med-2',
    brandName: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin & Potassium Clavulanate',
    category: 'Antibiotics',
    dosageForm: 'Tablet',
    strength: '625mg',
    manufacturer: 'GSK',
    rxRequired: true,
    schedule: 'Schedule H',
    isRestricted: false,
    description: 'Broad-spectrum antibiotic for bacterial infections.',
    image: 'https://picsum.photos/seed/aug/200/200'
  },
  {
    id: 'med-3',
    brandName: 'Telma 40',
    genericName: 'Telmisartan',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '40mg',
    manufacturer: 'Glenmark',
    rxRequired: true,
    schedule: 'Schedule H',
    isRestricted: false,
    description: 'Used to treat high blood pressure.',
    image: 'https://picsum.photos/seed/telma/200/200'
  },
  {
    id: 'med-4',
    brandName: 'Alprazolam 0.5',
    genericName: 'Alprazolam',
    category: 'Neurological',
    dosageForm: 'Tablet',
    strength: '0.5mg',
    manufacturer: 'Pfizer',
    rxRequired: true,
    schedule: 'Schedule X',
    isRestricted: true,
    description: 'Used for anxiety and panic disorders.',
    image: 'https://picsum.photos/seed/alp/200/200'
  },
  {
    id: 'med-5',
    brandName: 'Pan 40',
    genericName: 'Pantoprazole',
    category: 'Gastrointestinal',
    dosageForm: 'Tablet',
    strength: '40mg',
    manufacturer: 'Alkem',
    rxRequired: true,
    schedule: 'Schedule H',
    isRestricted: false,
    description: 'Used for acidity and stomach ulcers.',
    image: 'https://picsum.photos/seed/pan/200/200'
  }
];

export const MOCK_AUDIT_LOGS = [
  { id: 'log-1', adminId: 'admin-1', adminName: 'System Admin', action: 'Approved Pharmacy', targetId: 'pharmacy-1', targetType: 'pharmacy', details: 'Verified license GUJ/PHARM/12345', timestamp: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.1' },
  { id: 'log-2', adminId: 'admin-1', adminName: 'System Admin', action: 'Updated Medicine', targetId: 'med-1', targetType: 'medicine', details: 'Changed dosage form to Tablet', timestamp: new Date(Date.now() - 7200000).toISOString(), ipAddress: '192.168.1.1' },
  { id: 'log-3', adminId: 'admin-1', adminName: 'System Admin', action: 'Rejected Prescription', targetId: 'pres-1', targetType: 'prescription', details: 'Invalid doctor signature', timestamp: new Date(Date.now() - 10800000).toISOString(), ipAddress: '192.168.1.1' },
];

export const MOCK_FRAUD_ALERTS = [
  { id: 'fraud-1', targetId: 'pharmacy-2', targetType: 'pharmacy', reason: 'Duplicate GST Number detected with another entity', severity: 'high', status: 'pending', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'fraud-2', targetId: 'user-45', targetType: 'user', reason: 'Multiple high-value orders from same IP in 1 hour', severity: 'critical', status: 'investigating', createdAt: new Date(Date.now() - 43200000).toISOString() },
];

export const MOCK_FINANCIAL_RECORDS = [
  { id: 'fin-1', orderId: 'order-1', pharmacyId: 'pharmacy-1', totalAmount: 1200, commissionAmount: 120, sellerPayout: 1080, gstAmount: 180, status: 'reconciled', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'fin-2', orderId: 'order-2', pharmacyId: 'pharmacy-1', totalAmount: 850, commissionAmount: 85, sellerPayout: 765, gstAmount: 127.5, status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const MOCK_RECALLS = [
  { id: 'recall-1', medicineId: 'med-2', batchNumber: 'AUG23001', reason: 'Contamination reported in raw material', initiatedBy: 'Compliance Officer', status: 'active', createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export const MOCK_LOGISTICS_SLA = [
  { id: 'sla-1', orderId: 'order-1', expectedDeliveryTime: new Date(Date.now() + 3600000).toISOString(), isDelayed: false, requiresColdChain: true, currentTemp: 4.2, temperatureLogs: [4.1, 4.2, 4.3, 4.2] },
  { id: 'sla-2', orderId: 'order-2', expectedDeliveryTime: new Date(Date.now() - 3600000).toISOString(), actualDeliveryTime: new Date(Date.now() - 1800000).toISOString(), isDelayed: false, requiresColdChain: false },
];

export const MOCK_PRESCRIPTIONS = [
  { id: 'pres-1', customerId: 'customer-1', orderId: 'order-1', imageUrl: 'https://picsum.photos/seed/pres1/400/600', status: 'under_review', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'pres-2', customerId: 'customer-2', orderId: 'order-3', imageUrl: 'https://picsum.photos/seed/pres2/400/600', status: 'approved', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export const MOCK_MANUFACTURERS = [
  { id: 'man-1', name: 'Micro Labs Ltd', contact: 'contact@microlabs.com', location: 'Bangalore', status: 'active' },
  { id: 'man-2', name: 'GSK Pharmaceuticals', contact: 'info@gsk.com', location: 'Mumbai', status: 'active' },
  { id: 'man-3', name: 'Sun Pharma', contact: 'support@sunpharma.com', location: 'Vadodara', status: 'active' },
  { id: 'man-4', name: 'Cipla Ltd', contact: 'global@cipla.com', location: 'Mumbai', status: 'active' },
];

export const MOCK_LOGISTICS_PARTNERS = [
  { id: 'log-1', name: 'MedExpress Delivery', zones: ['380015', '380054'], status: 'active', fleetSize: 25 },
  { id: 'log-2', name: 'SwiftHealth Logistics', zones: ['395009', '395007'], status: 'active', fleetSize: 15 },
  { id: 'log-3', name: 'City Pharma Courier', zones: ['380001', '380009'], status: 'inactive', fleetSize: 10 },
];

export const MOCK_INVENTORY_ALERTS = [
  { id: 'alt-1', medicineName: 'Dolo 650', pharmacyName: 'City Health Pharmacy', type: 'low_stock', quantity: 5, threshold: 50, priority: 'high' },
  { id: 'alt-2', medicineName: 'Augmentin 625', pharmacyName: 'Apex Pharma', type: 'expiring_soon', expiryDate: '2026-04-15', priority: 'medium' },
  { id: 'alt-3', medicineName: 'Telma 40', pharmacyName: 'Wellness Medico', type: 'out_of_stock', quantity: 0, threshold: 20, priority: 'critical' },
];

export const MOCK_SELLER_INVENTORY = [
  { id: 'inv-1', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-1', price: 30, discountPrice: 28, stock: 500, isVisible: true, isFeatured: true },
  { id: 'inv-2', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-2', price: 150, discountPrice: 140, stock: 45, isVisible: true, isFeatured: false },
  { id: 'inv-3', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-3', price: 85, discountPrice: 80, stock: 120, isVisible: true, isFeatured: false },
  { id: 'inv-4', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-4', price: 200, discountPrice: 190, stock: 15, isVisible: true, isFeatured: true },
  { id: 'inv-5', pharmacyId: 'pharmacy-1', medicineMasterId: 'med-5', price: 45, discountPrice: 40, stock: 250, isVisible: true, isFeatured: false },
];

export const MOCK_INVENTORY_BATCHES = [
  { id: 'batch-1', sellerMedicineId: 'inv-1', pharmacyId: 'pharmacy-1', batchNumber: 'DLO24001', purchaseQty: 200, soldQty: 50, currentStock: 150, expiryDate: '2026-12-31', mfgDate: '2024-01-01', buyPrice: 20, sellPrice: 30, supplier: 'Micro Labs' },
  { id: 'batch-2', sellerMedicineId: 'inv-2', pharmacyId: 'pharmacy-1', batchNumber: 'AUG23001', purchaseQty: 100, soldQty: 55, currentStock: 45, expiryDate: '2025-06-30', mfgDate: '2023-07-01', buyPrice: 100, sellPrice: 150, supplier: 'GSK' },
];

export const MOCK_SELLER_PAYOUTS = [
  { id: 'pay-1', pharmacyId: 'pharmacy-1', amount: 15000, commission: 1500, gst: 2700, netAmount: 10800, status: 'paid', bankAccount: 'XXXX XXXX 1234', transactionId: 'TXN998877', periodStart: '2026-03-01', periodEnd: '2026-03-15', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'pay-2', pharmacyId: 'pharmacy-1', amount: 8000, commission: 800, gst: 1440, netAmount: 5760, status: 'pending', bankAccount: 'XXXX XXXX 1234', periodStart: '2026-03-16', periodEnd: '2026-03-31', createdAt: new Date().toISOString() },
];

export const MOCK_SELLER_RETURNS = [
  { id: 'ret-1', orderId: 'order-2', customerId: 'customer-1', pharmacyId: 'pharmacy-1', reason: 'damaged', description: 'Box was crushed and tablets were broken', status: 'pending', items: [{ medicineName: 'Dolo 650', quantity: 2 }], createdAt: new Date().toISOString() },
  { id: 'ret-2', orderId: 'order-1', customerId: 'customer-1', pharmacyId: 'pharmacy-1', reason: 'expired', description: 'Received near-expiry medicine', status: 'refunded', items: [{ medicineName: 'Augmentin 625', quantity: 1 }], createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const MOCK_COMPLIANCE_DOCS = [
  { id: 'doc-1', pharmacyId: 'pharmacy-1', type: 'Drug License (Form 20/21)', title: 'Drug License (Form 20, 21)', documentUrl: '#', expiryDate: '2027-12-31', status: 'verified', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'doc-2', pharmacyId: 'pharmacy-1', type: 'GST Certificate', title: 'GST Registration', documentUrl: '#', status: 'verified', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'doc-3', pharmacyId: 'pharmacy-1', type: 'Pharmacist Registration', title: 'Pharmacist Registration Certificate', documentUrl: '#', expiryDate: '2026-05-15', status: 'pending', createdAt: '2025-05-15', updatedAt: '2025-05-15' },
];

export const MOCK_SUPPORT_TICKETS = [
  { id: 'tick-1', userId: 'seller-1', subject: 'Delay in Payout', message: 'My payout for period 01-15 March is still pending.', status: 'open', priority: 'high', category: 'payout', createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'tick-2', userId: 'seller-1', subject: 'Inventory Sync Issue', message: 'Stock levels are not updating correctly.', status: 'resolved', priority: 'medium', category: 'inventory', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'not-1', userId: 'seller-1', title: 'New Order Received', message: 'You have a new order #order-4 from Customer 1', type: 'order', isRead: false, createdAt: new Date().toISOString() },
  { id: 'not-2', userId: 'seller-1', title: 'Low Stock Alert', message: 'Dolo 650 is running low on stock (5 units left)', type: 'inventory', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'not-3', userId: 'seller-1', title: 'License Expiring Soon', message: 'Your Pharmacist Registration expires in 60 days.', type: 'compliance', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'not-4', userId: 'delivery-1', title: 'New Delivery Available', message: 'A new delivery request is available near your location.', type: 'order', isRead: false, createdAt: new Date().toISOString() },
];

export const MOCK_DELIVERY_WALLET = {
  id: 'wallet-1',
  userId: 'delivery-1',
  balance: 450.50,
  totalEarnings: 12500.00,
  pendingWithdrawals: 0,
  lastPayoutDate: '2026-03-15'
};

export const MOCK_DELIVERY_TRANSACTIONS = [
  { id: 'txn-1', walletId: 'wallet-1', amount: 45.00, type: 'earning', status: 'completed', description: 'Delivery for Order #ORD-1234', orderId: 'order-1', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'txn-2', walletId: 'wallet-1', amount: 50.00, type: 'earning', status: 'completed', description: 'Delivery for Order #ORD-1235', orderId: 'order-2', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'txn-3', walletId: 'wallet-1', amount: 500.00, type: 'withdrawal', status: 'completed', description: 'Weekly Withdrawal', createdAt: '2026-03-15T10:00:00Z' },
];

export const MOCK_DELIVERY_PERFORMANCE = {
  userId: 'delivery-1',
  successRate: 98.5,
  onTimeRate: 95.0,
  averageRating: 4.8,
  cancellationRate: 1.2,
  totalDeliveries: 245,
  distanceTraveled: 1240.5
};

export const MOCK_DELIVERY_ASSIGNMENTS = [
  { 
    id: 'assign-1', 
    orderId: 'order-1', 
    deliveryStaffId: 'delivery-1', 
    status: 'assigned', 
    assignedAt: new Date().toISOString(),
    pickupOtp: '4561',
    deliveryOtp: '7892'
  }
];

export const MOCK_AVAILABLE_ORDERS = [
  { 
    id: 'order-4', 
    customerId: 'customer-2', 
    pharmacyId: 'pharmacy-1', 
    totalAmount: 1500, 
    status: 'ready_for_pickup', 
    createdAt: new Date().toISOString(),
    pharmacyName: 'City Health Pharmacy',
    customerName: 'Jane Smith',
    distance: '2.5 km',
    payout: 45.00
  },
  { 
    id: 'order-5', 
    customerId: 'customer-3', 
    pharmacyId: 'pharmacy-2', 
    totalAmount: 900, 
    status: 'ready_for_pickup', 
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    pharmacyName: 'Apex Pharma',
    customerName: 'Robert Brown',
    distance: '4.1 km',
    payout: 60.00
  }
];

export const MOCK_CHATS = [
  { id: 'msg-1', senderId: 'customer-1', receiverId: 'delivery-1', orderId: 'order-1', message: 'Please leave it at the gate.', timestamp: new Date(Date.now() - 600000).toISOString(), isRead: true },
  { id: 'msg-2', senderId: 'delivery-1', receiverId: 'customer-1', orderId: 'order-1', message: 'Sure, I will be there in 5 mins.', timestamp: new Date(Date.now() - 540000).toISOString(), isRead: true },
];
