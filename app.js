import express from 'express';
import 'dotenv/config';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// routes
import stripeRoutes from './routes/stripe.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

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

app.use('/api/stripe', stripeRoutes);

let endpointSecret;
// This is your Stripe CLI webhook secret for testing your endpoint locally.
endpointSecret =
  'whsec_ffafd07b5fda0fe891ec1bd62ea5e9f0a7152ac21cfba35966f7f6dfb3661380';

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'];

    let data;
    let eventType;

    if (endpointSecret) {
      // https://www.youtube.com/watch?v=_TVrn-pyTo8
      let event;

      try {
        const payload = request.body.toString();
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        console.log('webHUCCO VERIFICATO!');
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = request.body.data.object;
      eventType = request.body.type;
    }

    if (eventType === 'checkout.session.completed') {
      console.log('BOH');
    } else if (eventType === 'payment_intent.succeeded') {
      const paymentIntentSucceeded = data;
      console.log(paymentIntentSucceeded);
    }
    // // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     console.log('PAGAMENTO SUCCESSONE!');
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// If we get till these middlewares (which access req, res), it means the previous routes gave some error

app.listen(port, () => console.log(`Server running on port ${port}`));
