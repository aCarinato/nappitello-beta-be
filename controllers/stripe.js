import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Pass stripe secret key to the frontend
// @route   POST /api/order/place-order
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    // const { totalPrice } = req.body;

    // calculate the total price in the backend, it is more secure against a malicious actor

    const { email, stripeId, totalPrice, shipping } = req.body;
    // console.log('CIAO DA BACKEND');
    // console.log(req.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      // amount: 1000,
      currency: 'eur',
      // instead of coding a list of payment methods, we can turn them on and off from the dashboard
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      customer: stripeId,
      // receipt_email: 'alessandro.carinato@gmail.com',
      description: 'NAPPITELLO - Ordine effettuato con successo',
      shipping: shipping,
      // shipping: {
      //   name: 'Gigetto Mancuso',
      //   address: {
      //     city: 'Trieste',
      //     country: 'IT',
      //     line1: 'Via Lollo Mulon, 883',
      //     postal_code: '38118',
      //     state: 'Friuli Venezia Giulia',
      //   },
      // },
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
