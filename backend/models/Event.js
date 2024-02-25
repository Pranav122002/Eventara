const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
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