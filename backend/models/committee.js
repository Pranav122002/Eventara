const mongoose = require('mongoose');

const committeeSchema = mongoose.Schema({
    committee_name: {
        type: String,
        required: true
    },
    committee_image: {
        type: String,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EVENT'
    }],
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }],
    committee_desc: {
        type: String,
        required: true
    },
    committee_head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }],
    creation_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    meeting_schedule: {
        frequency: String,
        time: String,
        location: String
    },
    tags: [String],
    budget: Number,
    contact_information: {
        email: String,
        phone_number: String,
        office_location: String
    },
    tasks: [String]
});

const Committee = mongoose.model('COMMITTEE', committeeSchema);

module.exports = Committee;
