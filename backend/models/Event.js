const mongoose = require('mongoose')


const eventSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    time: {
        type: String,
    },
    mode : {
        type: String,
    },
    register:{
        type: String,
    },
    date: {
        type: Date,

    },
    location: {
        type: String,
    },
    bookings:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BOOKING'
    },
    approvals: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'USER'
            },
            status: {
                type: String,
                enum: ['accepted', 'rejected', 'pending'],
                default: 'pending'
            }
        }
    ],
    organizer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'COMMITTEE'
    },

})

module.exports = mongoose.model('EVENT', eventSchema)