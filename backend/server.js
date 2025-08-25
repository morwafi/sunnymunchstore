const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const cartMergeRoutes = require('./routes/cartMerge');
const cartSession = require("./middleware/cartSession");
const user = require("./routes/user")
const  settings = require('./routes/settings');
const trackingRoutes = require('./routes/tracking');
const cookieParser = require('cookie-parser');
const locationRoute = require('./routes/location')
const payfastRoutes = require("./routes/generateSignature")
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://sunnymunch.com', // Use your real domain here
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Parse form data

app.use('/api/cart/', cartSession ,cartRoutes);
app.use('/api/cartmerge/', cartMergeRoutes)
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/product', productRoutes)
app.use('/api/settings', settings)
app.use('/product-uploads', express.static(path.join(__dirname, 'product-uploads')));
app.use('/api/users', user);
app.use('/api/location', locationRoute);
app.use("/api/payfast", payfastRoutes);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch(console.error);
