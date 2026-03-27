import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import { logError, logFlow, validateRequiredFields } from '../utils/flowLogger';
import type {
  ComplianceDocument,
  DeliveryAssignment,
  MedicineMaster,
  Notification,
  Order,
  Pharmacy,
  Prescription,
  ReturnRequest,
  SellerMedicine,
  SellerPayout,
  SupportTicket,
  UserProfile,
} from '../types';

type Dictionary = Record<string, unknown>;

type FilterOptions = Record<string, string | number | boolean | undefined>;

type PaymentResponse = {
  success: boolean;
  transactionId: string;
  message?: string;
};

type AnalyticsData = {
  totalOrders: number;
  revenue: number;
  customers: number;
};

const nowIso = () => new Date().toISOString();

const FALLBACK_ANALYTICS: AnalyticsData = {
  totalOrders: 0,
  revenue: 0,
  customers: 0,
};

function toDictionary(value: unknown): Dictionary {
  if (value && typeof value === 'object') {
    return value as Dictionary;
  }
  return {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  return [];
}

function normalizeUserProfile(id: string, data: DocumentData): UserProfile {
  const source = toDictionary(data);
  return {
    uid: asString(source.uid, id),
    email: asString(source.email),
    displayName: asString(source.displayName),
    role: (asString(source.role, 'customer') as UserProfile['role']) ?? 'customer',
    phoneNumber: asString(source.phoneNumber),
    photoURL: asString(source.photoURL),
    addresses: Array.isArray(source.addresses) ? (source.addresses as UserProfile['addresses']) : [],
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizePharmacy(id: string, data: DocumentData): Pharmacy {
  const source = toDictionary(data);
  const ownerId = asString(source.ownerId, asString(source.sellerId));
  const verificationStatus = asString(source.verificationStatus, asString(source.status, 'pending'));
  return {
    id,
    sellerId: ownerId,
    ownerId,
    name: asString(source.name),
    description: asString(source.description),
    address: toDictionary(source.address) as Pharmacy['address'],
    contactNumber: asString(source.contactNumber),
    email: asString(source.email),
    operatingHours: asString(source.operatingHours),
    verificationStatus: (verificationStatus as Pharmacy['verificationStatus']) ?? 'pending',
    status: verificationStatus,
    deliveryAvailable: asBoolean(source.deliveryAvailable),
    pickupAvailable: asBoolean(source.pickupAvailable),
    minOrderValue: asNumber(source.minOrderValue),
    deliveryFee: asNumber(source.deliveryFee),
    rating: asNumber(source.rating),
    reviewCount: asNumber(source.reviewCount),
    image: asString(source.image),
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeMedicine(id: string, data: DocumentData): MedicineMaster {
  const source = toDictionary(data);
  return {
    id,
    brandName: asString(source.brandName),
    genericName: asString(source.genericName),
    category: asString(source.category),
    dosageForm: asString(source.dosageForm),
    strength: asString(source.strength),
    rxRequired: asBoolean(source.rxRequired),
    schedule: (asString(source.schedule, 'None') as MedicineMaster['schedule']) ?? 'None',
    description: asString(source.description),
    manufacturer: asString(source.manufacturer),
    image: asString(source.image),
    isRestricted: asBoolean(source.isRestricted),
  };
}

function normalizeInventory(id: string, data: DocumentData): SellerMedicine {
  const source = toDictionary(data);
  return {
    id,
    pharmacyId: asString(source.pharmacyId),
    medicineMasterId: asString(source.medicineMasterId),
    price: asNumber(source.price),
    discountPrice: typeof source.discountPrice === 'number' ? source.discountPrice : undefined,
    stock: asNumber(source.stock),
    isVisible: asBoolean(source.isVisible, true),
    isFeatured: asBoolean(source.isFeatured),
    masterData: source.masterData as SellerMedicine['masterData'],
    pharmacyData: source.pharmacyData as SellerMedicine['pharmacyData'],
  };
}

function normalizeOrder(id: string, data: DocumentData): Order {
  const source = toDictionary(data);
  return {
    id,
    customerId: asString(source.customerId),
    pharmacyId: asString(source.pharmacyId),
    status: (asString(source.status, 'pending') as Order['status']) ?? 'pending',
    totalAmount: asNumber(source.totalAmount),
    deliveryAddress: toDictionary(source.deliveryAddress) as Order['deliveryAddress'],
    orderType: (asString(source.orderType, 'delivery') as Order['orderType']) ?? 'delivery',
    prescriptionId: asString(source.prescriptionId),
    createdAt: asString(source.createdAt, nowIso()),
    updatedAt: asString(source.updatedAt, nowIso()),
    items: Array.isArray(source.items) ? (source.items as Order['items']) : [],
    pharmacyName: asString(source.pharmacyName),
    customerName: asString(source.customerName),
  };
}

function normalizePrescription(id: string, data: DocumentData): Prescription {
  const source = toDictionary(data);
  return {
    id,
    customerId: asString(source.customerId || source.userId),
    orderId: asString(source.orderId),
    imageUrl: asString(source.imageUrl),
    status: (asString(source.status, 'pending') as Prescription['status']) ?? 'pending',
    pharmacistId: asString(source.pharmacistId),
    remarks: asString(source.remarks),
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeNotification(id: string, data: DocumentData): Notification {
  const source = toDictionary(data);
  return {
    id,
    userId: asString(source.userId),
    title: asString(source.title),
    message: asString(source.message),
    type: (asString(source.type, 'system') as Notification['type']) ?? 'system',
    isRead: asBoolean(source.isRead),
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeTicket(id: string, data: DocumentData): SupportTicket & { description?: string } {
  const source = toDictionary(data);
  const message = asString(source.message || source.description);
  return {
    id,
    userId: asString(source.userId),
    subject: asString(source.subject),
    message,
    description: message,
    status: (asString(source.status, 'open') as SupportTicket['status']) ?? 'open',
    priority: (asString(source.priority, 'medium') as SupportTicket['priority']) ?? 'medium',
    category: (asString(source.category, 'technical') as SupportTicket['category']) ?? 'technical',
    createdAt: asString(source.createdAt, nowIso()),
    updatedAt: asString(source.updatedAt, nowIso()),
  };
}

function normalizePayout(id: string, data: DocumentData): SellerPayout {
  const source = toDictionary(data);
  return {
    id,
    pharmacyId: asString(source.pharmacyId),
    amount: asNumber(source.amount),
    commission: asNumber(source.commission),
    gst: asNumber(source.gst),
    netAmount: asNumber(source.netAmount),
    status: (asString(source.status, 'pending') as SellerPayout['status']) ?? 'pending',
    bankAccount: asString(source.bankAccount),
    transactionId: asString(source.transactionId),
    periodStart: asString(source.periodStart, nowIso()),
    periodEnd: asString(source.periodEnd, nowIso()),
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeCompliance(id: string, data: DocumentData): ComplianceDocument {
  const source = toDictionary(data);
  return {
    id,
    sellerId: asString(source.sellerId),
    type: asString(source.type),
    documentUrl: asString(source.documentUrl),
    status: (asString(source.status, 'pending') as ComplianceDocument['status']) ?? 'pending',
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeReturn(id: string, data: DocumentData): ReturnRequest {
  const source = toDictionary(data);
  return {
    id,
    orderId: asString(source.orderId),
    customerId: asString(source.customerId),
    pharmacyId: asString(source.pharmacyId),
    reason: (asString(source.reason, 'other') as ReturnRequest['reason']) ?? 'other',
    description: asString(source.description),
    status: (asString(source.status, 'pending') as ReturnRequest['status']) ?? 'pending',
    items: Array.isArray(source.items) ? (source.items as ReturnRequest['items']) : [],
    createdAt: asString(source.createdAt, nowIso()),
  };
}

function normalizeDeliveryAssignment(id: string, data: DocumentData): DeliveryAssignment {
  const source = toDictionary(data);
  return {
    id,
    orderId: asString(source.orderId),
    deliveryStaffId: asString(source.deliveryStaffId),
    status: (asString(source.status, 'assigned') as DeliveryAssignment['status']) ?? 'assigned',
    notes: asString(source.notes),
    assignedAt: asString(source.assignedAt, nowIso()),
    completedAt: asString(source.completedAt),
    pickupOtp: asString(source.pickupOtp),
    deliveryOtp: asString(source.deliveryOtp),
    proofOfPickup: asString(source.proofOfPickup),
    proofOfDelivery: asString(source.proofOfDelivery),
    failureReason: asString(source.failureReason),
    cashCollected: asNumber(source.cashCollected),
    temperatureAlert: asBoolean(source.temperatureAlert),
  };
}

function handleFirestoreError(error: unknown, label: string): void {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('requires an index')) {
    console.error(`Firestore index missing (${label}):`, message);
    return;
  }
  console.error(`Error in ${label}:`, error);
}

function applyFilters<T extends Dictionary>(rows: T[], filters: FilterOptions = {}): T[] {
  const active = Object.entries(filters).filter(([, value]) => value !== undefined);
  if (active.length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    active.every(([key, value]) => {
      if (value === undefined) return true;
      return row[key] === value;
    }),
  );
}

async function listCollection<T>(
  collectionName: string,
  normalize: (id: string, data: DocumentData) => T,
  filters: FilterOptions = {},
): Promise<T[]> {
  try {
    const constraints: QueryConstraint[] = [];
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        constraints.push(where(key, '==', value));
      }
    }

    const ref = collection(db, collectionName);
    const snapshot = constraints.length > 0 ? await getDocs(query(ref, ...constraints)) : await getDocs(ref);
    const rows = snapshot.docs.map((entry) => normalize(entry.id, entry.data()));

    if (constraints.length === 0) {
      return applyFilters(rows as Dictionary[] as T[], filters);
    }

    return rows;
  } catch (error) {
    handleFirestoreError(error, `listCollection:${collectionName}`);
    return [];
  }
}

async function createDoc<T extends Dictionary>(collectionName: string, payload: T): Promise<string> {
  try {
    const ref = await addDoc(collection(db, collectionName), payload);
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, `createDoc:${collectionName}`);
    return '';
  }
}

async function patchDoc(collectionName: string, id: string, patch: Dictionary): Promise<boolean> {
  try {
    await updateDoc(doc(db, collectionName, id), patch);
    return true;
  } catch (error) {
    handleFirestoreError(error, `patchDoc:${collectionName}`);
    return false;
  }
}

async function removeDoc(collectionName: string, id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    handleFirestoreError(error, `removeDoc:${collectionName}`);
    return false;
  }
}

async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? normalizeUserProfile(uid, snap.data()) : null;
  } catch (error) {
    handleFirestoreError(error, 'getUserProfile');
    return null;
  }
}

async function getUsers(): Promise<UserProfile[]> {
  return listCollection('users', normalizeUserProfile);
}

async function createUser(user: Partial<UserProfile> & { uid?: string; id?: string }): Promise<UserProfile> {
  const uid = user.uid ?? user.id ?? `user-${Date.now()}`;
  const payload: Dictionary = {
    uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    role: user.role ?? 'customer',
    status: (user as Dictionary).status ?? 'active',
    phoneNumber: user.phoneNumber ?? '',
    photoURL: user.photoURL ?? '',
    addresses: user.addresses ?? [],
    createdAt: user.createdAt ?? nowIso(),
  };

  await createDoc('users', payload);
  return normalizeUserProfile(uid, payload);
}

async function updateUser(id: string, patch: Dictionary): Promise<UserProfile | null> {
  const ok = await patchDoc('users', id, patch);
  if (!ok) {
    return null;
  }
  const snap = await getDoc(doc(db, 'users', id));
  return snap.exists() ? normalizeUserProfile(id, snap.data()) : null;
}

async function deleteUser(id: string): Promise<boolean> {
  return removeDoc('users', id);
}

async function getPharmacies(filters: FilterOptions = {}): Promise<Pharmacy[]> {
  const normalizedFilters: FilterOptions = { ...filters };

  if (normalizedFilters.sellerId !== undefined && normalizedFilters.ownerId === undefined) {
    normalizedFilters.ownerId = normalizedFilters.sellerId;
    delete normalizedFilters.sellerId;
  }

  const ownerId = asString(normalizedFilters.ownerId);
  if (ownerId) {
    const ownerMatches = await listCollection('pharmacies', normalizePharmacy, { ...normalizedFilters, ownerId });
    const validOwnerMatches = ownerMatches.filter((pharmacy) => Boolean(pharmacy.id) && Boolean(pharmacy.name));
    if (ownerMatches.length > 0 && validOwnerMatches.length === 0) {
      logError('DATA_MISMATCH', {
        type: 'DATA',
        detail: 'Pharmacy exists but not bindable to UI (missing id/name mapping)',
      });
    }
    if (ownerMatches.length > 0) {
      logFlow('GET_PHARMACIES', {
        expected: { ownerId, strategy: 'ownerId query' },
        received: { count: ownerMatches.length, validCount: validOwnerMatches.length },
        status: validOwnerMatches.length === ownerMatches.length ? 'success' : 'partial',
      });
      return validOwnerMatches;
    }

    try {
      const directDoc = await getDoc(doc(db, 'pharmacies', ownerId));
      if (directDoc.exists()) {
        const normalized = normalizePharmacy(directDoc.id, directDoc.data());
        if (!normalized.ownerId) {
          await patchDoc('pharmacies', directDoc.id, {
            ownerId,
            sellerId: normalized.sellerId || ownerId,
            updatedAt: nowIso(),
          });
        }
        logFlow('GET_PHARMACIES', {
          expected: { ownerId, strategy: 'direct doc fallback' },
          received: { count: 1 },
          success: true,
        });
        return [normalized];
      }
    } catch (error) {
      handleFirestoreError(error, 'getPharmacies:docFallback');
    }

    const legacySellerMatches = await listCollection('pharmacies', normalizePharmacy, { sellerId: ownerId });
    if (legacySellerMatches.length > 0) {
      await Promise.all(
        legacySellerMatches.map((pharmacy) =>
          patchDoc('pharmacies', pharmacy.id, {
            ownerId,
            sellerId: ownerId,
            updatedAt: nowIso(),
          }),
        ),
      );
      const migrated = legacySellerMatches.map((pharmacy) => ({ ...pharmacy, ownerId }));
      logFlow('GET_PHARMACIES', {
        expected: { ownerId, strategy: 'legacy sellerId fallback' },
        received: { count: migrated.length },
        success: true,
      });
      return migrated;
    }

    logFlow('GET_PHARMACIES', {
      expected: { ownerId, strategy: 'owner/doc/seller' },
      received: { count: 0 },
      success: false,
      error: 'No pharmacy found',
    });
    return [];
  }

  if (normalizedFilters.status !== undefined && normalizedFilters.verificationStatus === undefined) {
    const statusValue = normalizedFilters.status;
    const [statusMatches, verificationMatches] = await Promise.all([
      listCollection('pharmacies', normalizePharmacy, { ...normalizedFilters, status: statusValue }),
      listCollection('pharmacies', normalizePharmacy, { ...normalizedFilters, verificationStatus: statusValue }),
    ]);
    const merged = [...statusMatches, ...verificationMatches].filter(
      (pharmacy, index, arr) => arr.findIndex((entry) => entry.id === pharmacy.id) === index,
    );
    logFlow('GET_PHARMACIES', {
      expected: { filters: { ...normalizedFilters, status: statusValue }, strategy: 'status+verification fallback' },
      received: { count: merged.length },
      success: true,
    });
    return merged;
  }

  const data = await listCollection('pharmacies', normalizePharmacy, normalizedFilters);
  logFlow('GET_PHARMACIES', {
    expected: { filters: normalizedFilters },
    received: { count: data.length },
    status: data.length > 0 ? 'success' : 'fail',
  });
  return data;
}

async function updatePharmacy(id: string, patch: Dictionary): Promise<boolean> {
  const normalizedPatch: Dictionary = { ...patch, updatedAt: nowIso() };
  if (patch.status !== undefined && patch.verificationStatus === undefined) {
    normalizedPatch.verificationStatus = patch.status;
  }
  if (patch.verificationStatus !== undefined && patch.status === undefined) {
    normalizedPatch.status = patch.verificationStatus;
  }
  return patchDoc('pharmacies', id, normalizedPatch);
}

async function createPharmacy(payload: Dictionary): Promise<Pharmacy> {
  const ownerId = asString(payload.ownerId, asString(payload.sellerId));
  if (!ownerId) {
    throw new Error('ownerId is required to create pharmacy');
  }
  const normalizedPayload: Dictionary = {
    id: ownerId,
    ownerId,
    sellerId: ownerId,
    name: asString(payload.name, 'New Pharmacy'),
    description: asString(payload.description),
    address: toDictionary(payload.address),
    contactNumber: asString(payload.contactNumber),
    email: asString(payload.email),
    operatingHours: asString(payload.operatingHours, '09:00-21:00'),
    verificationStatus: asString(payload.verificationStatus, 'pending'),
    status: asString(payload.status, 'pending'),
    deliveryAvailable: asBoolean(payload.deliveryAvailable, true),
    pickupAvailable: asBoolean(payload.pickupAvailable, true),
    minOrderValue: asNumber(payload.minOrderValue),
    deliveryFee: asNumber(payload.deliveryFee),
    rating: asNumber(payload.rating),
    reviewCount: asNumber(payload.reviewCount),
    image: asString(payload.image),
    createdAt: nowIso(),
  };

  const pharmacyId = asString(payload.id || ownerId);
  if (pharmacyId) {
    try {
      await setDoc(doc(db, 'pharmacies', pharmacyId), normalizedPayload, { merge: true });
      return normalizePharmacy(pharmacyId, normalizedPayload);
    } catch (error) {
      handleFirestoreError(error, 'createPharmacy');
    }
  }

  const id = await createDoc('pharmacies', normalizedPayload);
  return normalizePharmacy(id || `pharmacy-${Date.now()}`, normalizedPayload);
}

async function getMedicines(filters: FilterOptions = {}): Promise<MedicineMaster[]> {
  const normalizedFilters = { ...filters };
  delete normalizedFilters.includeAll;
  const medicineMaster = await listCollection('medicine_master', normalizeMedicine, normalizedFilters);
  if (medicineMaster.length > 0) {
    return medicineMaster;
  }
  return listCollection('medicines', normalizeMedicine, normalizedFilters);
}

async function createMedicine(payload: Dictionary): Promise<Dictionary> {
  const medicinePayload: Dictionary = {
    ...payload,
    createdAt: nowIso(),
  };

  if (medicinePayload.pharmacyId) {
    if (!asString(medicinePayload.medicineMasterId)) {
      logFlow('CREATE_MEDICINE_INVENTORY', {
        expected: ['medicineMasterId'],
        received: { medicineMasterId: medicinePayload.medicineMasterId },
        success: false,
        error: 'missing medicineMasterId',
      });
      throw new Error('medicineMasterId is required for inventory item');
    }
    if (typeof medicinePayload.price !== 'number' || medicinePayload.price <= 0 || typeof medicinePayload.stock !== 'number' || medicinePayload.stock < 0) {
      logFlow('CREATE_MEDICINE_INVENTORY', {
        expected: ['price > 0', 'stock >= 0'],
        received: { price: medicinePayload.price, stock: medicinePayload.stock },
        success: false,
        error: 'invalid price/stock',
      });
      throw new Error('price must be > 0 and stock must be >= 0');
    }
    const id = await createDoc('inventory', {
      pharmacyId: medicinePayload.pharmacyId,
      medicineMasterId: asString(medicinePayload.medicineMasterId, asString(medicinePayload.id)),
      price: asNumber(medicinePayload.price),
      discountPrice: asNumber(medicinePayload.discountPrice),
      stock: asNumber(medicinePayload.stock, 0),
      isVisible: asBoolean(medicinePayload.isVisible, true),
      isFeatured: asBoolean(medicinePayload.isFeatured),
      createdAt: nowIso(),
      ...medicinePayload,
    });
    return { id, ...medicinePayload };
  }

  const id = await createDoc('medicine_master', medicinePayload);
  return { id, ...medicinePayload };
}

async function updateMedicine(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('medicine_master', id, { ...patch, updatedAt: nowIso() });
}

async function getInventory(filters: FilterOptions = {}): Promise<SellerMedicine[]> {
  const inventory = await listCollection('inventory', normalizeInventory, filters);
  const validInventory = inventory.filter((item) => {
    const isValid = Boolean(item.pharmacyId) && Boolean(item.medicineMasterId) && typeof item.price === 'number' && typeof item.stock === 'number';
    if (!isValid) {
      logFlow('GET_INVENTORY_VALIDATION', {
        expected: ['pharmacyId', 'medicineMasterId', 'price:number', 'stock:number'],
        received: item,
        success: false,
      });
    }
    return isValid;
  });
  return validInventory;
}

async function updateInventory(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('inventory', id, { ...patch, updatedAt: nowIso() });
}

async function deleteInventory(id: string): Promise<boolean> {
  return removeDoc('inventory', id);
}

async function createInventoryEntry(payload: Dictionary): Promise<SellerMedicine> {
  const validation = validateRequiredFields(payload, ['pharmacyId', 'medicineMasterId', 'price', 'stock']);
  if (!validation.ok) {
    logFlow('CREATE_INVENTORY', {
      expected: ['pharmacyId', 'medicineMasterId', 'price', 'stock'],
      received: { missing: validation.missing },
      success: false,
      error: 'missing required fields',
    });
    throw new Error('pharmacyId and medicineMasterId are required');
  }
  if (typeof payload.price !== 'number' || payload.price <= 0 || typeof payload.stock !== 'number' || payload.stock < 0) {
    logFlow('CREATE_INVENTORY', {
      expected: ['price > 0', 'stock >= 0'],
      received: { price: payload.price, stock: payload.stock },
      success: false,
      error: 'invalid price or stock',
    });
    throw new Error('price must be > 0 and stock must be >= 0');
  }
  const id = await createDoc('inventory', {
    ...payload,
    createdAt: nowIso(),
    isVisible: asBoolean(payload.isVisible, true),
    isFeatured: asBoolean(payload.isFeatured, false),
  });
  logFlow('CREATE_INVENTORY', {
    expected: ['inventory record created'],
    received: { id, medicineMasterId: payload.medicineMasterId, pharmacyId: payload.pharmacyId },
    success: Boolean(id),
  });
  return normalizeInventory(id || `inv-${Date.now()}`, {
    ...payload,
    createdAt: nowIso(),
  });
}

async function createOrder(payload: Dictionary): Promise<Order> {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const firstItem = toDictionary(items[0]);
  const orderPayload: Dictionary = {
    ...payload,
    medicineMasterId: asString(payload.medicineMasterId, asString(firstItem.medicineMasterId, asString(firstItem.medicineId))),
    quantity: asNumber(payload.quantity, asNumber(firstItem.quantity, 1)),
    price: asNumber(payload.price, asNumber(firstItem.price)),
    status: asString(payload.status, 'pending'),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const id = await createDoc('orders', orderPayload);
  await createDoc('notifications', {
    userId: asString(orderPayload.pharmacyId),
    orderId: id,
    message: `New order received (${id})`,
    type: 'order',
    isRead: false,
    createdAt: nowIso(),
  });
  logFlow('CREATE_ORDER', {
    expected: ['customerId', 'pharmacyId', 'totalAmount'],
    received: { id, customerId: orderPayload.customerId, pharmacyId: orderPayload.pharmacyId, totalAmount: orderPayload.totalAmount },
    success: Boolean(id),
  });
  return normalizeOrder(id || `order-${Date.now()}`, orderPayload);
}

async function getOrders(filters: FilterOptions = {}): Promise<Order[]> {
  const orders = await listCollection('orders', normalizeOrder, filters);
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function getOrderById(id: string): Promise<Order | null> {
  try {
    const snap = await getDoc(doc(db, 'orders', id));
    return snap.exists() ? normalizeOrder(id, snap.data()) : null;
  } catch (error) {
    handleFirestoreError(error, 'getOrderById');
    return null;
  }
}

async function updateOrder(id: string, patch: Dictionary): Promise<boolean> {
  const previousOrder = await getOrderById(id);
  const ok = await patchDoc('orders', id, { ...patch, updatedAt: nowIso() });
  if (ok && patch.status && previousOrder) {
    await createDoc('notifications', {
      userId: previousOrder.customerId,
      orderId: id,
      message: `Order ${id} status updated to ${String(patch.status)}`,
      type: 'order',
      isRead: false,
      createdAt: nowIso(),
    });
  }
  logFlow('UPDATE_ORDER', {
    expected: { id, patchKeys: Object.keys(patch) },
    received: { id, updated: ok },
    success: ok,
  });
  return ok;
}

function subscribeToOrders(filters: FilterOptions, callback: (orders: Order[]) => void): () => void {
  try {
    const constraints: QueryConstraint[] = [];
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        constraints.push(where(key, '==', value));
      }
    }

    const ref = collection(db, 'orders');
    const source = constraints.length > 0 ? query(ref, ...constraints) : ref;

    return onSnapshot(
      source,
      (snap) => {
        const orders = snap.docs
          .map((entry) => normalizeOrder(entry.id, entry.data()))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        callback(orders);
      },
      () => callback([]),
    );
  } catch (error) {
    handleFirestoreError(error, 'subscribeToOrders');
    callback([]);
    return () => undefined;
  }
}

async function createPrescription(payload: Dictionary): Promise<Prescription> {
  const rxPayload: Dictionary = {
    ...payload,
    customerId: asString(payload.customerId || payload.userId),
    createdAt: nowIso(),
  };
  const id = await createDoc('prescriptions', rxPayload);
  return normalizePrescription(id || `rx-${Date.now()}`, rxPayload);
}

async function getPrescriptions(filters: FilterOptions = {}): Promise<Prescription[]> {
  const prescriptions = await listCollection('prescriptions', normalizePrescription, filters);
  return [...prescriptions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function updatePrescription(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('prescriptions', id, { ...patch, updatedAt: nowIso() });
}

async function getNotifications(filters: FilterOptions = {}): Promise<Notification[]> {
  const notifications = await listCollection('notifications', normalizeNotification, filters);
  return [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function updateNotification(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('notifications', id, { ...patch, updatedAt: nowIso() });
}

async function deleteNotification(id: string): Promise<boolean> {
  return removeDoc('notifications', id);
}

async function getTickets(filters: FilterOptions = {}): Promise<(SupportTicket & { description?: string })[]> {
  return listCollection('tickets', normalizeTicket, filters);
}

async function createTicket(payload: Dictionary): Promise<SupportTicket & { description?: string }>
{
  const ticketPayload: Dictionary = {
    ...payload,
    message: asString(payload.message),
    description: asString(payload.description, asString(payload.message)),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    status: asString(payload.status, 'open'),
    priority: asString(payload.priority, 'medium'),
    category: asString(payload.category, 'technical'),
  };
  const id = await createDoc('tickets', ticketPayload);
  return normalizeTicket(id || `ticket-${Date.now()}`, ticketPayload);
}

async function getPayouts(filters: FilterOptions = {}): Promise<SellerPayout[]> {
  const normalizedFilters = { ...filters };
  const ownerId = normalizedFilters.ownerId ?? normalizedFilters.sellerId;

  if (ownerId && normalizedFilters.pharmacyId === undefined) {
    const pharmacies = await getPharmacies({ ownerId: asString(ownerId) });
    const pharmacyIds = new Set(pharmacies.map((pharmacy) => pharmacy.id));
    const payouts = await listCollection('payouts', normalizePayout);
    return payouts
      .filter((payout) => pharmacyIds.has(payout.pharmacyId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  delete normalizedFilters.ownerId;
  delete normalizedFilters.sellerId;
  const payouts = await listCollection('payouts', normalizePayout, normalizedFilters);
  return [...payouts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function updatePayout(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('payouts', id, { ...patch, updatedAt: nowIso() });
}

async function getCompliance(filters: FilterOptions = {}): Promise<ComplianceDocument[]> {
  return listCollection('compliance', normalizeCompliance, filters);
}

async function createCompliance(payload: Dictionary): Promise<ComplianceDocument> {
  const compliancePayload: Dictionary = {
    ...payload,
    status: asString(payload.status, 'pending'),
    createdAt: nowIso(),
  };
  const id = await createDoc('compliance', compliancePayload);
  return normalizeCompliance(id || `compliance-${Date.now()}`, compliancePayload);
}

async function updateCompliance(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('compliance', id, { ...patch, updatedAt: nowIso() });
}

async function getReturns(filters: FilterOptions = {}): Promise<ReturnRequest[]> {
  const returns = await listCollection('returns', normalizeReturn, filters);
  return [...returns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function updateReturn(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('returns', id, { ...patch, updatedAt: nowIso() });
}

async function getDeliveryAssignments(filters: FilterOptions = {}): Promise<DeliveryAssignment[]> {
  const assignments = await listCollection('deliveryAssignments', normalizeDeliveryAssignment, filters);
  return [...assignments].sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
}

async function createDeliveryAssignment(payload: Dictionary): Promise<DeliveryAssignment> {
  const assignmentPayload: Dictionary = {
    ...payload,
    assignedAt: nowIso(),
    status: asString(payload.status, 'assigned'),
  };
  const id = await createDoc('deliveryAssignments', assignmentPayload);
  return normalizeDeliveryAssignment(id || `assignment-${Date.now()}`, assignmentPayload);
}

async function updateDeliveryAssignment(id: string, patch: Dictionary): Promise<boolean> {
  return patchDoc('deliveryAssignments', id, { ...patch, updatedAt: nowIso() });
}

async function getAnalytics(filters: FilterOptions = {}): Promise<AnalyticsData> {
  const ownerId = asString(filters.ownerId ?? filters.sellerId);
  let orders: Order[] = [];

  if (ownerId) {
    const pharmacies = await getPharmacies({ ownerId });
    const pharmacyIds = new Set(pharmacies.map((pharmacy) => pharmacy.id));
    const allOrders = await getOrders();
    orders = allOrders.filter((order) => pharmacyIds.has(order.pharmacyId));
  } else {
    orders = await getOrders(filters);
  }

  if (orders.length === 0) {
    return FALLBACK_ANALYTICS;
  }

  const customers = new Set(orders.map((order) => order.customerId).filter(Boolean));
  return {
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    customers: customers.size,
  };
}

async function processPayment(payload: Dictionary): Promise<PaymentResponse> {
  const amount = asNumber(payload.amount);
  return {
    success: amount >= 0,
    transactionId: `txn-${Date.now()}`,
    message: amount >= 0 ? 'Payment simulated successfully' : 'Invalid amount',
  };
}

const concreteApi = {
  // existing exports
  getUserProfile,
  addMedicineMaster: createMedicine,
  addInventoryItem: createInventoryEntry,
  createOrder,
  getOrders,
  subscribeToOrders,

  // user management
  getUsers,
  createUser,
  updateUser,
  deleteUser,

  // pharmacies + catalog
  getPharmacies,
  createPharmacy,
  updatePharmacy,
  getMedicines,
  createMedicine,
  updateMedicine,
  getInventory,
  createInventoryEntry,
  updateInventory,
  deleteInventory,

  // order + delivery
  getOrderById,
  updateOrder,
  getDeliveryAssignments,
  createDeliveryAssignment,
  updateDeliveryAssignment,

  // customer + prescription
  processPayment,
  createPrescription,
  getPrescriptions,
  updatePrescription,

  // notifications + support
  getNotifications,
  updateNotification,
  deleteNotification,
  getTickets,
  createTicket,

  // finance + compliance + analytics
  getPayouts,
  updatePayout,
  getCompliance,
  createCompliance,
  updateCompliance,
  getReturns,
  updateReturn,
  getAnalytics,
};

type ApiShape = typeof concreteApi & Record<string, (...args: unknown[]) => unknown>;

function getFallbackByName(name: string): unknown {
  if (name.startsWith('get')) {
    if (name === 'getAnalytics') {
      return FALLBACK_ANALYTICS;
    }
    return [];
  }

  if (name.startsWith('create')) {
    return { id: '' };
  }

  if (name.startsWith('update') || name.startsWith('delete')) {
    return false;
  }

  return null;
}

export const api = new Proxy(concreteApi as ApiShape, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === 'function') {
      return async (...args: unknown[]) => {
        try {
          return await value(...args);
        } catch (error) {
          handleFirestoreError(error, String(prop));
          logFlow(`API_${String(prop).toUpperCase()}`, {
            expected: ['function executes without throw'],
            received: { argsCount: args.length },
            success: false,
            error,
          });
          const fallback = getFallbackByName(String(prop));
          return fallback;
        }
      };
    }

    if (value !== undefined) {
      return value;
    }

    return async () => getFallbackByName(String(prop));
  },
});
