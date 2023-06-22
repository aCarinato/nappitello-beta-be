// libs
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// models
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Get the current user to protect routes
// @route   GET /api/auth/current-user
// @access  Private
export const currentUser = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id).select('-password');
    // res.json(user);
    if (user) {
      res.json({ ok: true, success: true, user });
    } else {
      res.json({ ok: false, success: false });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  //   console.log(req.body);
  const { name, surname, email, password, language } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    res.status(500).json(err);
  }

  // create a stripe customer
  //   try {
  //   } catch (err) {
  //     return res.json({
  //       error: '0 - Utente non trovato. Controllare email.',
  //     });
  //   }
  let preferred_locales;
  if (language === 'it') preferred_locales = ['it-IT'];
  if (language === 'en') preferred_locales = ['en-US'];

  const newStripeCustomer = {
    name,
    email,
    description: 'testing stripe customer functionality',
    preferred_locales,
  };

  const customer = await stripe.customers.create(newStripeCustomer);

  // console.log(customer);

  if (customer) {
    // create a user in the db
    const createdUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      language,
      stripeId: customer.id,
    });

    const newUser = await createdUser.save();

    res.status(200).json({
      success: true,
      newUser: {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        stripeId: customer.id,
      },
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);

  // res.json({ message: 'Grintaaa' });
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
    // res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json(err);
  }

  if (!existingUser) {
    return res.json({
      error: '0 - Utente non trovato. Controllare email.',
    });
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    res.status(500).json(err);
  }

  if (!isValidPassword) {
    return res.json({
      error: '1 - Password errata',
    });
  }

  let token;
  // ////////////////////////////////
  // MAX SIGNS THE TOKEN WITH _id AND EMAIL, KALORAAT ONLY WITH _id
  token = jwt.sign(
    { _id: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '2d' }
  );

  res.status(201).json({
    name: existingUser.name,
    userId: existingUser._id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    stripeId: existingUser.stripeId,
    token: token,
  });
};

// @desc    Check if current user is admin
// @route   GET /api/auth/current-admin
// @access  Private
export const currentUserIsAdmin = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id);
    // console.log(user);
    // res.json(user);
    if (user.isAdmin) {
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
