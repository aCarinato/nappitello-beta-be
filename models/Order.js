import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        product: {
          type: String,
          required: true,
          // type: mongoose.Schema.Types.ObjectId,
          // required: true,
          // ref: 'User',
        },
        countInStock: { type: Number, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    // orderItems: [
    //   {
    //     nameIT: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },
    //     nameEN: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },
    //     nameDE: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },
    //     slugIT: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },
    //     slugEN: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },
    //     slugDE: {
    //       type: String,
    //       required: true,
    //       // unique: true,
    //     },

    //     quantity: { type: Number, required: true },
    //     // image: { type: String, required: true },
    //     price: { type: Number, required: true },
    //     // product: {
    //     //   type: mongoose.Schema.Types.ObjectId,
    //     //   required: true,
    //     //   ref: 'Product',
    //     // },
    //   },
    // ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      stateOrProvince: { type: String, required: false },
    },
    chargeSucceeded: {
      type: Boolean,
      required: true,
      default: false,
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    // paymentMethod: {
    //   type: String,
    //   required: true,
    // },
    // paymentResult: { id: String, status: String, email_address: String },
    // itemsPrice: {
    //   type: Number,
    //   required: true,
    // },
    // shippingPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },
    // taxPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },
    // totalPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },

    // isPaid: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
    // paidAt: {
    //   type: Date,
    // },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
