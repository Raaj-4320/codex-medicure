import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import miscRoutes from './routes/misc.routes.js';

const app = express();
const PORT = 5000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // increased for demo polling
});
app.use('/api', limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/delivery-assignments', deliveryRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/medicines', pharmacyRoutes); // Medicines are under pharmacy routes in the original
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', miscRoutes); // health and locations

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
