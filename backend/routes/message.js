const express = require("express");
const router = express.Router();
const GROUP_MESSAGE = require("../models/group_message");
const PERSONAL_MESSAGE = require("../models/personal_message");

router.get("/api/all-group-messages", async (req, res) => {
  try {
    const messages = await GROUP_MESSAGE.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.get(
  "/api/all-personal-messages/:senderId/:receiverId",
  async (req, res) => {
    const { senderId, receiverId } = req.params;

    try {
      const messages = await PERSONAL_MESSAGE.find({
        $or: [
          { sender_id: senderId, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: senderId },
        ],
      }).sort({ createdAt: 1 });

      res.json(messages);
    } catch (error) {
      console.error("Error fetching personal messages:", error);
      res.status(500).json({ error: "Failed to fetch personal messages" });
    }
  }
);

router.post("/api/save-group-message", async (req, res) => {
  const { message, sender_name, sender_id } = req.body;

  try {
    const newMessage = new GROUP_MESSAGE({
      message: message,
      sender_name: sender_name,
      sender_id: sender_id,
    });

    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

router.post("/api/save-personal-message", async (req, res) => {
  const { message, sender_name, receiver_name, sender_id, receiver_id } =
    req.body;

  try {
    const newMessage = new PERSONAL_MESSAGE({
      message: message,
      sender_name: sender_name,
      receiver_name: receiver_name,
      sender_id: sender_id,
      receiver_id: receiver_id,
    });

    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    console.error("Error saving personal message:", error);
    res.status(500).json({ error: "Failed to save personal message" });
  }
});

module.exports = router;
