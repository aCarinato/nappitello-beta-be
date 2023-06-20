import Order from '../models/Order.js';

// @desc    Create a new order
// @route   POST /api/orders/create-new-order
// @access  Private
export const createNewOrder = async (req, res) => {
  try {
    // console.log(req.user._id);
    // console.log(req.body);
    const orderItems = req.body.cartItems.map((item) => {
      const { _id, price, countInStock, quantity } = item;
      return { product: _id, price, countInStock, quantity };
    });

    const order = {
      user: req.user._id,
      orderItems: orderItems,
      shippingAddress: req.body.shippingAddress,
    };

    const newOrder = await new Order(order).save();

    console.log(newOrder);

    if (newOrder) res.json({ success: true });

    // somewhere qty in stock needs to be updated
  } catch (err) {
    console.log(err);
  }
};
