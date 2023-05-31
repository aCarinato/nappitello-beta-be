import express from 'express';
import 'dotenv/config';
import Stripe from 'stripe';
// routes
import stripeRoutes from './routes/stripe.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// let endpointSecret;
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_ffafd07b5fda0fe891ec1bd62ea5e9f0a7152ac21cfba35966f7f6dfb3661380';

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
    //     const sig = request.headers['stripe-signature'];

    //     let event;

    // try {
    //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // } catch (err) {
    //   console.log(`Webhook Error: ${err.message}`);
    //   response.status(400).send(`Webhook Error: ${err.message}`);
    //   return;
    // }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        console.log(`chargeSucceeded`);
        console.log(chargeSucceeded);
        // Then define and call a function to handle the event charge.succeeded
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!');
        console.log(paymentIntent);
        break;
      // ... handle other event types
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

app.listen(port, () => console.log(`Server running on port ${port}`));
