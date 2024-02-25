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
    rooms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ROOM"
    }],
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
    ]
})

module.exports = mongoose.model('EVENT', eventSchema)