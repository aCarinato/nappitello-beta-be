import Order from '../models/Order.js';
// utils
import { sendEmail } from '../utils/sendEmail.js';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    // console.log(newOrder);

    if (newOrder) res.json({ success: true });

    // somewhere qty in stock needs to be updated
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

// @desc    Fetch all orders
// @route   POST /api/orders/fulfill-order
// @access  Private (admin only)
export const fulfillOrder = async (req, res) => {
  const msg = {
    to: 'supergrowers.co@gmail.com', // Change to your recipient
    from: 'alessandro.carinato@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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
// export const fulfillOrder = async (req, res) => {
//   try {
//     const message = `
//     <html lang="en">
//         <head>
//           <link rel="preconnect" href="https://fonts.googleapis.com">
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//           <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
//         </head>
//         <body>
//           <div style="color: rgb(63, 80, 110); font-family: 'Montserrat', sans-serif; font-size: 16px; ">
//             <div style="width: 350px; background-color: #fff; margin: 12px auto padding: 0.8rem">
//               <div style="text-align: center;" >
//                 <h2 style="color: rgb(13, 0, 134);">ciaooooooo</h2>
//               </div>
//             </div>
//           </div>
//         </body>
//     </html>`;

//     sendEmail({
//       to: 'alessandro.carinato@gmail.com',
//       subject: 'DAI DESSO',
//       text: message,
//     });

//     res.status(200).json({ success: true, message: `Email successfully sent` });
//   } catch (err) {
//     console.log(err);
//   }
// };
