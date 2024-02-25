const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");

router.get("/api/all-users-except/:id", async (req, res, next) => {
  try {
    const users = await USER.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "role",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (ex) {
    next(ex);
  }
});

router.get("/api/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.post("/api/search-users", (req, res) => {
  let userPattern = new RegExp(req.body.query, "i"); // add "^" at start for exact search
  USER.find({ name: { $regex: userPattern } })
    .select("_id email name")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get('/api/admins', async (req, res) => {
  try {
    const admins = await USER.find({ role: 'admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
