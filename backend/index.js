const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  new_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  old_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

app.post("/addproduct", async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log("Product Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.post("/removeproduct", async (req, res) => {
  await Product.destroy({
    where: { id: req.body.id },
  });

  console.log("Product Removed");
  res.json({ success: true });
});

app.get("/allproducts", async (req, res) => {
  const products = await Product.findAll();
  console.log("All Products Fetched");
  res.json(products);
});

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// User Model
const User = sequelize.define('User', {
  name: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true, allowNull: false },
  password: Sequelize.STRING,
  cartData: Sequelize.JSON,
  date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

// Signup Route
app.post('/signup', async (req, res) => {
  const check = await User.findOne({ where: { email: req.body.email } });

  if (check) {
    return res.status(400).json({ success: false, error: "existing user found with email address" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) { cart[i] = 0; }

  const user = await User.create({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });


  const data = {
    user:{
      id:user.id
    }
  }

  const token = jwt.sign({ user: { id: user.id } }, 'secret_key');
  res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const token = jwt.sign({ user: { id: user.id } }, 'secret_key');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

app.get('/newcollections', async (req, res) => {
  let products = await Product.findAll();
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

app.get('/popularinwomen', async (req, res) => {
  let products = await Product.findAll({ where: { category: "women" } });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

    const fetchUser = async (req,res,next)=>{
      const token = req.header('auth-token');
      if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
      }
      else{
        try{
          const data = jwt.verify(token,'secret_key');
          req.user = data.user;
          next();
        }
        catch(error){
          res.status(401).send({errors:"please authenticate a valid token"})

        }
          }

    }

app.post('/addtocart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  cartData[req.body.itemId] += 1;
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send("Added");
});
app.post('/removefromcart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  if (cartData[req.body.itemId] > 0) {
    cartData[req.body.itemId] -= 1;
  }
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send("Removed");
});
app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await User.findOne({ where: { id: req.user.id } });
  res.json(userData.cartData);
});


sequelize.sync().then(() => {
  app.listen(port, (error) => {
    if (!error) {
      console.log("Server Running On Port " + port);
      console.log("MySQL Connected Successfully!");
    } else {
      console.log("Error: " + error);
    }
  });
});