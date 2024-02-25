const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    img: {
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
    }
})

module.exports = mongoose.model('EVENT', eventSchema)