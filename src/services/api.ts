import {
collection,
doc,
getDoc,
getDocs,
addDoc,
updateDoc,
query,
where,
onSnapshot,
deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
// import { toast } from "sonner";
import {
UserProfile,
SellerMedicine,
Order,
MedicineMaster,
} from "../types";

// ---------------- ERROR HANDLER ----------------
function handleFirestoreError(error: any, label: string) {
const message = error?.message || String(error);

if (message.includes("requires an index")) {
console.error("INDEX ERROR:", message);
// toast.error("Missing Firestore index. Please create it.");
return;
}

console.error(`Error in ${label}:`, error);
// toast.error(`Error: ${label}`);
}

// ---------------- USERS ----------------
async function getUserProfile(uid: string): Promise<UserProfile | null> {
try {
const docSnap = await getDoc(doc(db, "users", uid));

```
if (!docSnap.exists()) return null;

return {
  uid: docSnap.id,
  ...docSnap.data(),
} as UserProfile;
```

} catch (e) {
handleFirestoreError(e, "getUserProfile");
return null;
}
}

// ---------------- MEDICINES ----------------
async function addMedicineMaster(data: Partial<MedicineMaster>) {
try {
const docRef = await addDoc(collection(db, "medicines"), {
...data,
createdAt: new Date().toISOString(),
});

```
 toast.success("Medicine added");
return docRef.id;
```

} catch (e) {
handleFirestoreError(e, "addMedicineMaster");
return null;
}
}

// ---------------- INVENTORY ----------------
async function addInventoryItem(data: Partial<SellerMedicine>) {
try {
const docRef = await addDoc(collection(db, "inventory"), {
...data,
createdAt: new Date().toISOString(),
});

```
toast.success("Item added");
return docRef.id;
```

} catch (e) {
handleFirestoreError(e, "addInventoryItem");
return null;
}
}

// ---------------- ORDERS ----------------
async function createOrder(data: Partial<Order>) {
try {
const docRef = await addDoc(collection(db, "orders"), {
...data,
createdAt: new Date().toISOString(),
});

```
toast.success("Order created");
return docRef.id;
```

} catch (e) {
handleFirestoreError(e, "createOrder");
return null;
}
}

async function getOrders(filters: any = {}): Promise<Order[]> {
try {
let q = query(collection(db, "orders"));

```
if (filters.customerId) {
  q = query(q, where("customerId", "==", filters.customerId));
}

if (filters.pharmacyId) {
  q = query(q, where("pharmacyId", "==", filters.pharmacyId));
}

const snap = await getDocs(q);

const data = snap.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
})) as Order[];

// ✅ Sort locally (avoids index requirement)
return data.sort(
  (a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
);
```

} catch (e) {
handleFirestoreError(e, "getOrders");
return [];
}
}

// ---------------- SUBSCRIPTIONS ----------------
function subscribeToOrders(
filters: any,
callback: (data: Order[]) => void
) {
try {
let q = query(collection(db, "orders"));

```
if (filters.customerId) {
  q = query(q, where("customerId", "==", filters.customerId));
}

if (filters.pharmacyId) {
  q = query(q, where("pharmacyId", "==", filters.pharmacyId));
}

return onSnapshot(
  q,
  (snap) => {
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    callback(
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
    );
  },
  (error) => {
    handleFirestoreError(error, "subscribeToOrders");
    callback([]); // ✅ prevents infinite loading
  }
);
```

} catch (e) {
handleFirestoreError(e, "subscribeToOrders");
return () => {};
}
}

// ---------------- EXPORT ----------------
export const api = {
getUserProfile,
addMedicineMaster,
addInventoryItem,
createOrder,
getOrders,
subscribeToOrders,
};
