// models
import Order from '../../models/Order.js';

export const setOrderPaid = async (id) => {
  try {
    const updatedOrder = await Order.updateOne(
      { paymentIntentId: id },
      { $set: { chargeSucceeded: true } }
    );
    console.log(updatedOrder);
    return;
  } catch (e) {
    console.log(e);
  }
};

export const setOrderShipped = async (id) => {
  try {
    const updatedOrder = await Order.updateOne(
      { _id: id },
      { $set: { isShipped: true, shippedAt: new Date() } }
    );
    console.log(updatedOrder);
    return;
  } catch (e) {
    console.log(e);
  }
};
