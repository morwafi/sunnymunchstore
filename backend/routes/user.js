const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Regiser user
router.post('/user-register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }
    await user.create(
        {
            userId: uuidv4(),
            username: req.body.username,
            email: req.body.email,
            birthdate: req.body.birthdate,
            password: hashedPassword,
            notification: req.body.notifications
        }
    );
    res.json({ success: true});
})

//login user
router.post('/user-login', async (req, res) => {
  const findUser = await user.findOne({ email: req.body.email });
  if (!findUser) return res.json({ success: false });

  const match = await bcrypt.compare(req.body.password, findUser.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign(
    { id: findUser._id, username: findUser.username, email: findUser.email, birthdate: findUser.birthdate },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, { httpOnly: true, sameSite: "lax", secure: false }); // secure:true in prod
  res.json({ success: true });
});


router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.json({
    loggedIn: true,
    userId: decoded.id,
    username: decoded.username,
    email: decoded.email,
    birthdate: decoded.birthdate,
  });
} catch (err) {
  res.json({
    loggedIn: false,
    userId: null,
    username: null,
    email: null,
    birthdate: null,
  });
}
});

module.exports = router