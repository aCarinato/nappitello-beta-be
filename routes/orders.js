import express from 'express';

const router = express.Router();

import { requireSignin } from '../middlewares/checkAuth.js';
import { createNewOrder } from '../controllers/orders.js';

router.post('/create-new-order', requireSignin, createNewOrder);

export default router;
