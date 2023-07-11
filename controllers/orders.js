// libs
import sgMail from '@sendgrid/mail';
// models
import Order from '../models/Order.js';
// utils
import { createOrderFulfillmentEmail } from '../utils/templates/orderFulfillment.js';
import { setOrderShipped } from '../utils/orderManagement/orderManagement.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc    Create a new order
// @route   POST /api/orders/create-new-order
// @access  Private
export const createNewOrder = async (req, res) => {
  try {
    // console.log(req.user._id);
    // console.log(req.body);
    const orderItems = req.body.cart.cartItems.map((item) => {
      const { _id, price, countInStock, quantity } = item;
      return { product: _id, price, countInStock, quantity };
    });

    const order = {
      paymentIntentId: req.body.paymentIntentId,
      user: req.user._id,
      orderItems: orderItems,
      shippingAddress: req.body.cart.shippingAddress,
    };

    const newOrder = await new Order(order).save();

    // console.log(newOrder);

    if (newOrder) res.json({ success: true });

    // TODO: somewhere qty in stock needs to be updated !!!!!!
  } catch (err) {
    console.log(err);
  }
};

// @desc    Fetch all orders
// @route   GET /api/orders/get-all-orders
// @access  Private (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    // console.log(orders);
    if (orders) res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Fetch an order
// @route   GET /api/orders/get-order/:id
// @access  Private (admin only)
export const getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const order = await Order.findById(id);
    // console.log(order);
    if (order) res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Fetch all orders
// @route   POST /api/orders/fulfill-order
// @access  Private (admin only)
export const fulfillOrder = async (req, res) => {
  const { orderId, customer } = req.body;

  await setOrderShipped(orderId);

  const emailHtml = createOrderFulfillmentEmail(customer.name);

  const msg = {
    to: customer.email, // Change to your recipient
    from: process.env.SG_EMAIL_FROM, // 'info@sogrowers.com', // Change to your verified sender
    subject: `Nappitello - Fulfillment order ${orderId}`,
    // text: 'and easy to do anywhere, even with Node.js',
    html: emailHtml,
  };

  // const message = {
  //   personalizations: [
  //     {
  //       to: [
  //         {
  //           email: 'supergrowers.co@gmail.com',
  //           name: 'John Doe',
  //         },
  //       ],
  //     },
  //   ],
  //   from: {
  //     email: 'info@sogrowers.com',
  //     name: 'Example Order Confirmation',
  //   },
  //   replyTo: {
  //     email: 'info@sogrowers.com',
  //     name: 'Example Customer Service Team',
  //   },
  //   subject: 'Your Example Order Confirmation',
  //   content: [
  //     {
  //       type: 'text/html',
  //       value:
  //         '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
  //     },
  //   ],
  // };

  try {
    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        res
          .status(200)
          .json({ success: true, message: `Email successfully sent` });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Fetch all orders
// @route   GET /api/orders/get-customer-orders/
// @access  Private
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    // console.log(orders);
    if (orders) res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log(err);
  }
};
