import express from 'express';

const router = express.Router();

import { requireSignin, requireAdmin } from '../middlewares/checkAuth.js';
import {
  createNewOrder,
  getAllOrders,
  fulfillOrder,
  getOrder,
  getCustomerOrders,
} from '../controllers/orders.js';

router.post('/create-new-order', requireSignin, createNewOrder);
router.get('/get-all-orders', requireSignin, requireAdmin, getAllOrders);
router.post('/fulfill-order', requireSignin, requireAdmin, fulfillOrder);
router.get('/get-order/:id', requireSignin, getOrder);
router.get('/get-customer-orders', requireSignin, getCustomerOrders);

export default router;
