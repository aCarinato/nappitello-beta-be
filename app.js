import express from 'express';
import 'dotenv/config';
// import Stripe from 'stripe';
// routes
import stripeRoutes from './routes/stripe.js';
import authRoutes from './routes/auth.js';
import ordersRoutes from './routes/orders.js';
import customersRoutes from './routes/customers.js';
import productsRoutes from './routes/products.js';
// utils
import connectDB from './utils/db.js';
import { setOrderPaid } from './utils/orderManagement/orderManagement.js';

connectDB();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );

  next();
});

// STRIPE webhook
app.post(
  '/webhook',
  express.json({ type: 'application/json' }),
  (request, response) => {
    const event = request.body;

    // app.post(
    //   '/webhook',
    //   express.raw({ type: 'application/json' }),
    //   (request, response) => {
    //     let event = request.body;
    //     // Only verify the event if you have an endpoint secret defined.
    //     // Otherwise use the basic event deserialized with JSON.parse
    //     if (endpointSecret) {
    //       // Get the signature sent by Stripe
    //       const signature = request.headers['stripe-signature'];
    //       try {
    //         event = stripe.webhooks.constructEvent(
    //           request.body,
    //           signature,
    //           endpointSecret
    //         );
    //       } catch (err) {
    //         response
    //           .status(400)
    //           .send({ error: `Webhook Error: ${err.message}`, event: event });
    //         return;
    //         // console.log(`⚠️  Webhook signature verification failed.`, err.message);
    //         // return response.sendStatus(400);
    //       }
    //     }

    // app.post(
    //   '/webhook',
    //   express.raw({ type: 'application/json' }),
    //   (request, response) => {
    //     const sig = request.headers['stripe-signature'];

    //     let event;

    //     try {
    //       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    //     } catch (err) {
    //       console.log(`Webhook Error: ${err.message}`);
    //       response.status(400).send(`Webhook Error: ${err.message}`);
    //       return;
    //     }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        console.log(`chargeSucceeded`);
        console.log(chargeSucceeded);
        if (chargeSucceeded.payment_intent)
          // Then define and call a function to handle the event charge.succeeded
          setOrderPaid(chargeSucceeded.payment_intent);
        break;
      // case 'payment_intent.succeeded':
      //   const paymentIntent = event.data.object;
      //   console.log('PaymentIntent was successful!');
      //   console.log(paymentIntent);
      //   break;
      // ... handle other event types
      // case 'checkout.session.completed':
      //   const session = event.data.object;
      //   console.log('checkout.session.completed');
      //   console.log(session);
      //   // Save an order in your database, marked as 'awaiting payment'
      //   // createOrder(session);

      //   // Check if the order is paid (for example, from a card payment)
      //   //
      //   // A delayed notification payment will have an `unpaid` status, as
      //   // you're still waiting for funds to be transferred from the customer's
      //   // account.
      //   if (session.payment_status === 'paid') {
      //     console.log('PAGATTOO');
      //     // fulfillOrder(session);
      //   }

      //   break;

      // case 'checkout.session.async_payment_succeeded': {
      //   const session = event.data.object;
      //   console.log('checkout.session.async_payment_succeeded');
      //   console.log(session);
      //   // Fulfill the purchase...
      //   // fulfillOrder(session);

      //   break;
      // }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // if (event.type === 'checkout.session.completed') {
    //   console.log('checkout.session.completed COMPLETATA');
    //   console.log(event);
    // } else if (event.type === 'payment_intent.succeeded') {
    //   // const paymentIntentSucceeded = data;
    //   // console.log(paymentIntentSucceeded);
    //   console.log(event);
    // }

    response.send();
  }
);

const port = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/stripe', stripeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
