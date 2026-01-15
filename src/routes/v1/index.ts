import express from 'express';
import authRoutes from '../../features/auth/routes/auth.routes';
import transactionRoutes from '../../features/transaction/routes/transaction.route';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/transaction', transactionRoutes);

export default router;
