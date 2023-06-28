import User from '../models/User.js';

// @desc    Get customer details
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await User.findById(id);

    if (customer) res.status(200).json({ success: true, customer });
  } catch (err) {
    console.log(err);
  }
};
