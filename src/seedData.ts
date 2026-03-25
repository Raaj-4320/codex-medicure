import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

// Helper to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const seedDatabase = async () => {
  console.log('Starting seeding process...');

  // 1. Seed Medicine Master (300+ items)
  const medicineCategories = ['Analgesics', 'Antibiotics', 'Antivirals', 'Cardiovascular', 'Dermatological', 'Gastrointestinal', 'Respiratory', 'Neurological'];
  const dosageForms = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops'];
  
  const masterMedicines = [];
  for (let i = 1; i <= 305; i++) {
    masterMedicines.push({
      id: `med-master-${i}`,
      brandName: `BrandMed ${i}`,
      genericName: `GenericComp ${i}`,
      category: medicineCategories[i % medicineCategories.length],
      dosageForm: dosageForms[i % dosageForms.length],
      strength: `${(i % 10 + 1) * 50}mg`,
      rxRequired: i % 5 === 0,
      description: `High quality medicine for ${medicineCategories[i % medicineCategories.length].toLowerCase()} conditions.`,
      manufacturer: `PharmaCorp ${i % 10 + 1}`,
      image: `https://picsum.photos/seed/med${i}/200/200`
    });
  }

  const batch = writeBatch(db);
  masterMedicines.forEach(med => {
    const ref = doc(db, 'medicinesMaster', med.id);
    batch.set(ref, med);
  });
  await batch.commit();
  console.log('Seeded Medicine Master');

  // 2. Seed Pharmacies (50+ items)
  const cities = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Mumbai', 'Pune', 'Bangalore'];
  const areas = ['Satellite', 'Vastrapur', 'Adajan', 'Alkapuri', 'Kothrud', 'Indiranagar', 'Andheri'];
  
  const pharmacies = [];
  for (let i = 1; i <= 52; i++) {
    pharmacies.push({
      id: `pharmacy-${i}`,
      sellerId: `seller-${(i % 4) + 1}`, // Map to 4 demo sellers
      name: `City Health Pharmacy ${i}`,
      description: `Your trusted neighborhood pharmacy in ${cities[i % cities.length]}.`,
      address: {
        city: cities[i % cities.length],
        area: areas[i % areas.length],
        pincode: `3800${i % 10 + 10}`,
        state: i < 30 ? 'Gujarat' : 'Maharashtra',
        country: 'India'
      },
      contactNumber: `98765432${i.toString().padStart(2, '0')}`,
      email: `pharmacy${i}@example.com`,
      operatingHours: '9:00 AM - 10:00 PM',
      verificationStatus: i % 7 === 0 ? 'pending' : 'verified',
      verificationDetails: i % 7 === 0 ? {
        licenseNumber: `LIC-${10000 + i}`,
        licenseExpiry: '2027-12-31',
        ownerName: `Owner ${i}`,
        submittedAt: randomDate(new Date(2026, 0, 1), new Date()),
        documents: [
          { type: 'Drug License', url: 'https://example.com/doc1.pdf' },
          { type: 'GST Certificate', url: 'https://example.com/doc2.pdf' }
        ]
      } : null,
      deliveryAvailable: true,
      pickupAvailable: true,
      minOrderValue: 100 + (i * 5),
      deliveryFee: 30 + (i % 5),
      rating: 4 + (Math.random() * 1),
      reviewCount: 10 + i,
      image: `https://picsum.photos/seed/pharm${i}/400/300`,
      createdAt: new Date().toISOString()
    });
  }

  const pharmBatch = writeBatch(db);
  pharmacies.forEach(p => {
    const ref = doc(db, 'pharmacies', p.id);
    pharmBatch.set(ref, p);
  });
  await pharmBatch.commit();
  console.log('Seeded Pharmacies');

  // 3. Seed Seller Medicines (800+ items)
  // We'll map some master medicines to each pharmacy
  for (let pIdx = 0; pIdx < pharmacies.length; pIdx++) {
    const p = pharmacies[pIdx];
    const sellerMedBatch = writeBatch(db);
    // Each pharmacy gets ~15-20 medicines
    for (let mIdx = 0; mIdx < 16; mIdx++) {
      const masterMed = masterMedicines[(pIdx * 5 + mIdx) % masterMedicines.length];
      const smId = `sm-${p.id}-${masterMed.id}`;
      sellerMedBatch.set(doc(db, 'sellerMedicines', smId), {
        id: smId,
        pharmacyId: p.id,
        medicineMasterId: masterMed.id,
        price: 50 + (mIdx * 10),
        discountPrice: 45 + (mIdx * 10),
        stock: 100 + (mIdx * 5),
        isVisible: true,
        isFeatured: mIdx < 3
      });
    }
    await sellerMedBatch.commit();
  }
  console.log('Seeded Seller Medicines');

  // 4. Seed Service Areas
  const serviceAreaBatch = writeBatch(db);
  pharmacies.forEach(p => {
    serviceAreaBatch.set(doc(db, 'serviceAreas', `sa-${p.id}`), {
      id: `sa-${p.id}`,
      pharmacyId: p.id,
      city: p.address.city,
      area: p.address.area,
      pincode: p.address.pincode,
      deliveryTime: '30-60 mins'
    });
  });
  await serviceAreaBatch.commit();
  console.log('Seeded Service Areas');

  // 5. Seed Demo Users (Admin, Seller, etc.)
  // Note: We can't easily create Auth users in bulk without Admin SDK, 
  // but we can seed their Firestore profiles.
  const demoUsers = [
    { uid: 'admin-1', email: 'admin123@gmail.com', role: 'admin', displayName: 'System Admin' },
    { uid: 'seller-1', email: 'seller123@gmail.com', role: 'seller', displayName: 'Main Seller' },
    { uid: 'seller-2', email: 'seller2@gmail.com', role: 'seller', displayName: 'Apex Pharma' },
    { uid: 'seller-3', email: 'seller3@gmail.com', role: 'seller', displayName: 'Wellness Meds' },
    { uid: 'seller-4', email: 'seller4@gmail.com', role: 'seller', displayName: 'Global Health' },
    { uid: 'pharmacist-1', email: 'pharma1@gmail.com', role: 'pharmacist', displayName: 'Dr. Smith' },
    { uid: 'pharmacist-2', email: 'pharma2@gmail.com', role: 'pharmacist', displayName: 'Dr. Jane' },
    { uid: 'delivery-1', email: 'del1@gmail.com', role: 'delivery', displayName: 'John Delivery' },
    { uid: 'delivery-2', email: 'del2@gmail.com', role: 'delivery', displayName: 'Mike Delivery' },
    { uid: 'delivery-3', email: 'del3@gmail.com', role: 'delivery', displayName: 'Sarah Delivery' },
    { uid: 'delivery-4', email: 'del4@gmail.com', role: 'delivery', displayName: 'Tom Delivery' },
  ];

  // Add 8 customers
  for (let i = 1; i <= 8; i++) {
    demoUsers.push({
      uid: `customer-${i}`,
      email: `customer${i}@gmail.com`,
      role: 'customer',
      displayName: `Customer ${i}`
    });
  }

  const userBatch = writeBatch(db);
  demoUsers.forEach(u => {
    userBatch.set(doc(db, 'users', u.uid), {
      ...u,
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          area: 'Satellite',
          locality: 'Ramdevnagar',
          pincode: '380015',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    });
  });
  await userBatch.commit();
  console.log('Seeded Demo Users');

  // 6. Seed Orders (100+ items)
  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['UPI', 'Credit Card', 'Cash on Delivery'];
  
  const orders = [];
  for (let i = 1; i <= 120; i++) {
    const customer = demoUsers[11 + (i % 8)] as any; // Use customers
    const pharmacy = pharmacies[i % pharmacies.length];
    const status = orderStatuses[i % orderStatuses.length];
    
    orders.push({
      id: `order-${i}`,
      customerId: customer.uid,
      customerName: customer.displayName,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      items: [
        {
          id: `item-${i}-1`,
          medicineId: `med-master-${(i % 300) + 1}`,
          name: `Medicine ${i}`,
          price: 100 + (i % 50),
          quantity: (i % 3) + 1
        }
      ],
      totalAmount: 300 + (i * 10),
      status: status,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      paymentStatus: status === 'cancelled' ? 'refunded' : (i % 3 === 0 ? 'pending' : 'paid'),
      createdAt: randomDate(new Date(2026, 0, 1), new Date()),
      deliveryAddress: {
        id: 'addr-1',
        label: 'Home',
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        area: 'Satellite',
        locality: 'Ramdevnagar',
        pincode: '380015',
        isDefault: true
      }
    });
  }

  const orderBatch = writeBatch(db);
  orders.forEach(o => {
    orderBatch.set(doc(db, 'orders', o.id), o);
  });
  await orderBatch.commit();
  console.log('Seeded Orders');

  console.log('Seeding complete!');
};
