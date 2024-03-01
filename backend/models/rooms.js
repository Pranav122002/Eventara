const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    room_no: {
        type: String
    },
    venue: {
        type: String
    },
    available :{
        type : Boolean
    }
})

const ROOM = mongoose.model("ROOM", roomSchema)
module.exports = ROOM
