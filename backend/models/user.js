const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_no: {
    type:String,
    required: true
  },
  role: {
    type: String,
  },
});

const adminSchema = mongoose.Schema({
  admin: {
    assigned_committees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "COMMITTEE"
    }],
    assigned_events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "EVENT"
    }]
  }
})

const USER = mongoose.model("USER", userSchema);
const ADMIN = USER.discriminator("ADMIN", adminSchema)
module.exports = {USER, ADMIN}
