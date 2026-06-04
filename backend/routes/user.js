const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchUser = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  const check = await User.findOne({ where: { email: req.body.email } });
  if (check) {
    return res.status(400).json({ success: false, error: 'existing user found with email address' });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) { cart[i] = 0; }

  const user = await User.create({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });

  const token = jwt.sign({ user: { id: user.id } }, 'secret_key');
  res.json({ success: true, token });
});

// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const token = jwt.sign({ user: { id: user.id } }, 'secret_key');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: 'Wrong Password' });
    }
  } else {
    res.json({ success: false, errors: 'Wrong Email Id' });
  }
});

// Add to cart
router.post('/addtocart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  cartData[req.body.itemId] += 1;
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send('Added');
});

// Remove from cart
router.post('/removefromcart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  if (cartData[req.body.itemId] > 0) {
    cartData[req.body.itemId] -= 1;
  }
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send('Removed');
});

// Get cart
router.post('/getcart', fetchUser, async (req, res) => {
  console.log('GetCart');
  let userData = await User.findOne({ where: { id: req.user.id } });
  res.json(userData.cartData);
});

module.exports = router;