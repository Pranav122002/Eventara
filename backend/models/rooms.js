    const mongoose = require('mongoose')

    const roomSchema = mongoose.Schema({
        room_no:{
            type: String
        }
    })

    const ROOM = mongoose.model("ROOM", roomSchema)
    module.exports = ROOM
