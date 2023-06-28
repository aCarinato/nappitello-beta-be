import express from 'express';

const router = express.Router();

import { requireSignin, requireAdmin } from '../middlewares/checkAuth.js';
import { getCustomer } from '../controllers/customers.js';

router.get('/:id', requireSignin, requireAdmin, getCustomer);

export default router;
