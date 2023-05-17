import express from 'express';

const router = express.Router();

import { createPaymentIntent } from '../controllers/stripe.js';

// router.get('/current-user', requireSignin, currentUser);
router.post('/create-payment-intent', createPaymentIntent);

export default router;
