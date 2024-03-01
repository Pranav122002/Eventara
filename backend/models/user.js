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
    }],
    imp: {
      type: Number,
      default:0
    },
    signature: {
      type: String,
      default:"http://res.cloudinary.com/dt0cxgzqn/image/upload/v1709315133/images/rjhhgjuwsmicgvaomes6.png"
    }
  }
})

const USER = mongoose.model("USER", userSchema);
const ADMIN = USER.discriminator("ADMIN", adminSchema)
module.exports = {USER, ADMIN}
