const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload } = require('../config/cloudinary');

// Upload image
router.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: req.file.path
  });
});

// Add product
router.post('/addproduct', async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log('Product Saved');
  res.json({ success: true, name: req.body.name });
});

// Remove product
router.post('/removeproduct', async (req, res) => {
  await Product.destroy({ where: { id: req.body.id } });
  console.log('Product Removed');
  res.json({ success: true });
});

// Get all products
router.get('/allproducts', async (req, res) => {
  const products = await Product.findAll();
  console.log('All Products Fetched');
  res.json(products);
});

// New collections
router.get('/newcollections', async (req, res) => {
  let products = await Product.findAll();
  let newcollection = products.slice(1).slice(-8);
  console.log('NewCollection Fetched');
  res.send(newcollection);
});

// Popular in women
router.get('/popularinwomen', async (req, res) => {
  let products = await Product.findAll({ where: { category: 'women' } });
  let popular_in_women = products.slice(0, 4);
  console.log('Popular in women fetched');
  res.send(popular_in_women);
});

module.exports = router;