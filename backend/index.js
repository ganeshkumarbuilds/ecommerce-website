const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/', productRoutes);
app.use('/', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Express App is Running');
});

// Start server
sequelize.sync().then(() => {
  app.listen(PORT, (error) => {
    if (!error) {
      console.log('Server Running On Port ' + PORT);
      console.log('MySQL Connected Successfully!');
    } else {
      console.log('Error: ' + error);
    }
  });
});