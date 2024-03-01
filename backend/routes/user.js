const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const COMMITTEE = mongoose.model("COMMITTEE");

const ADMIN = mongoose.model("ADMIN");
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

router.get("/api/user/:userId/committees", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await USER.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscribedCommittees = await COMMITTEE.find({
      subscribers: new mongoose.Types.ObjectId(userId),
    });

    res.json({ committees: subscribedCommittees });
  } catch (error) {
    console.error("Error fetching user committees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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

// Get all the admins
router.get("/api/admins", async (req, res) => {
  try {
    const admins = await USER.find({ role: "admin" });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all events requested for approval
router.get("/api/admin-events/:id", async (req, res) => {
  const admin_id = req.params.id;

  try {
    const events = await ADMIN.findById(admin_id).populate(
      "admin.assigned_events"
    );

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
    console.log(err)
  }
});

// Get all committees requested for approval
router.get("/api/admin-committees/:id", async (req, res) => {
  const admin_id = req.params.id;
  // console.log(admin_id)

  try {
    const committees = await ADMIN.findById(admin_id).populate({
      path: "admin.assigned_committees",
      select: "committee_name approval_status",
    });
    // console.log(committees)
    res.status(200).json(committees);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post('/api/admin-signature', async (req, res) => {
  const { admin_id, sign_url } = req.body;
  console.log(req.body)
  try {
    const updatedAdmin = await ADMIN.findByIdAndUpdate(admin_id, {
      $set: { 'admin.signature': sign_url }
    }, { new: true });
    console.log(updatedAdmin.admin.signature)
    res.status(200).json(updatedAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/admin-signature/:admin_id', async (req, res) => {
  const { admin_id } = req.params;
  try {
    const admin = await ADMIN.findById(admin_id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ signature: admin.admin.signature });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});


module.exports = router;