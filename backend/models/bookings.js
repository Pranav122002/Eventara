const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    room_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ROOM'
    }],
    date:{
        type: Date
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    duration: {
        type: Number
    }
})

module.exports = mongoose.model('BOOKING',bookingSchema)