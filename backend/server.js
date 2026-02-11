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
// const allowedOrigins = [
//   'https://sinceitssunny.com',
//   'https://managementdev.sinceitssunny.com',
//   'https://dev.sinceitssunny.com'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like server-to-server)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed'));
//     }
//   },
//   credentials: true
// }));

// preflight
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Parse form data

app.get("/payment-success", (req, res) => {
  res.send("<h2>Payment Successful ✅</h2>");
});

app.get("/payment-cancel", (req, res) => {
  res.send("<h2>Payment Cancelled ❌</h2>");
});


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
if (process.env.NODE_ENV === "development") {

mongoose.connect(process.env.MONGO_DEV)  
.then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
.catch(console.error);

} else {
  mongoose.connect(process.env.MONGO_PROD)
  .then(() => {
      app.listen(5000, () => console.log('Server running on http://localhost:5000'));
    })
  .catch(console.error);
}


