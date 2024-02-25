const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const ADMIN = mongoose.model("ADMIN")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role, phone_no } = req.body;
    console.log(req.body)
    if (!name || !email || !password || !phone_no) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    USER.findOne({ $or: [{ email: email }] }).then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exist with that email" });
      }
      
    })
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new USER({
      name,
      email,
      password: hashedPassword,
      role: role,
      phone_no,
    });
    
    let newUser;
    if (role === "user") {
      const userData = await user.save();
      res.json(userData);
    } else if (role === "admin") {
      newUser = new ADMIN(user);
      const userData = await newUser.save();
      res.json(userData);
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "An error occurred while signing up." });
  }

});

router.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email and password" });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    console.log(savedUser)
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          const token = jwt.sign({ _id: savedUser.id }, JWT_SECRET);
          const { _id, name, email, role } = savedUser;

          res.json({ token, user: { _id, name, email, role } });
        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

module.exports = router;
