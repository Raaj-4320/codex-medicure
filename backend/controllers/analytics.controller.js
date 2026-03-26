import { getDb } from '../db/index.js';

export const getSellerAnalytics = async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) return res.status(400).json({ error: 'sellerId is required' });

    const db = await getDb();
    const pharmacy = (db.data.pharmacies || []).find((p) => p.sellerId === sellerId);
    if (!pharmacy) {
      return res.json({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalPayouts: 0,
        averageOrderValue: 0,
        topMedicines: [],
        monthlySales: [],
      });
    }

    const orders = (db.data.orders || []).filter((o) => o.pharmacyId === pharmacy.id);
    const inventory = (db.data.sellerMedicines || []).filter((i) => i.pharmacyId === pharmacy.id);
    const payouts = (db.data.payouts || []).filter((p) => p.sellerId === sellerId);

    const totalOrders = orders.length;
    const completedOrdersList = orders.filter((o) => o.status === 'delivered');
    const completedOrders = completedOrdersList.length;
    const pendingOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;

    const totalRevenue = completedOrdersList.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
    const totalPayouts = payouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const averageOrderValue = completedOrders ? Number((totalRevenue / completedOrders).toFixed(2)) : 0;

    const medicineTotals = new Map();
    completedOrdersList.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.medicineId || item.sellerMedicineId || item.medicineName || 'unknown';
        const current = medicineTotals.get(key) || { name: item.medicineName || item.name || key, totalSold: 0 };
        current.totalSold += Number(item.quantity || 0);
        if (!current.name || current.name === key) {
          const inv = inventory.find((m) => m.id === item.sellerMedicineId || m.medicineMasterId === item.medicineId);
          if (inv?.name) current.name = inv.name;
        }
        medicineTotals.set(key, current);
      });
    });

    const topMedicines = Array.from(medicineTotals.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    const monthMap = new Map();
    completedOrdersList.forEach((o) => {
      const date = new Date(o.createdAt || o.updatedAt || Date.now());
      const month = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const current = monthMap.get(month) || 0;
      monthMap.set(month, current + Number(o.totalAmount || o.total || 0));
    });

    const monthlySales = Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue }));

    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
      totalPayouts,
      averageOrderValue,
      topMedicines,
      monthlySales,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
