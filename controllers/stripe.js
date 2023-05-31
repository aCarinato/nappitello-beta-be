import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Pass stripe secret key to the frontend
// @route   POST /api/order/place-order
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice } = req.body;

    // calculate the total price in the backend, it is more secure against a malicious actor

    // CREATE A CUSTOMER
    // const customer = await stripe.customers.create({
    //   email: 'test@test.com',
    //   description:
    //     'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
    //   preferred_locales: ['it-IT'],
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      // amount: 1000,
      currency: 'eur',
      // instead of coding a list of payment methods, we can turn them on and off from the dashboard
      automatic_payment_methods: { enabled: true },
      // receipt_email: email,
      // receipt_email: 'alessandro.carinato@gmail.com',
      // description: 'THIS IS A TEST FROM STRIPE!',
    });
    // console.log(paymentIntent.client_secret);
    if (paymentIntent.client_secret) {
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (err) {
    res.status(404).json({ secret: process.env.STRIPE_SECRET_KEY }); // if no specific status is set, by default it would fall back to 500
    // return next(err); // this error is passed to the middleware that handles the error
  }
};
