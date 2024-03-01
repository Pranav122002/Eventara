const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const EVENT = mongoose.model('EVENT');
const ADMIN = mongoose.model('ADMIN')
const generatePDFFromCommittee = require('../functions/genPDF')
// Create a new event
router.post('/api/create-event', async (req, res) => {
        try {    
            const isEvent = true
            var event_info = req.body.eventFormData;
            // console.log(event_info.event_name)
            const name = event_info.event_name
            const date = event_info.event_date
            const location = event_info.event_location
            const time = event_info.event_time
            const mode = event_info.event_mode
            const image = event_info.event_image
            const register = event_info.event_register
            event_info = {name, date, time, location ,image ,register ,mode }
            
            const approvals = req.body.selectedAdmins?.map(adminId => ({
                user: adminId,
                status: 'pending'
            }));
    
            event_info.approvals = approvals
            // console.log(event_info.organizer)
            const event = new EVENT(event_info);
    
            const newevent = await event.save();
            console.log(event)
            //push the committee id to admins' assigned_committees.
            const updatedAdmin = await Promise.all(approvals.map(async (admin) => {
                try {
                    const admin_update = await ADMIN.findByIdAndUpdate(admin.user, {
                        $push: { 'admin.assigned_events': event._id }
                    }, { new: true })
                    await generatePDFFromCommittee(event, admin_update.phone_no, isEvent)
                } catch (err) {
                    console.error("Error updating admin:", err);
                }
    
    
            }))
    
    
            // console.log(newCommittee)
            // console.log(updatedAdmin)
            res.status(201).json(newevent);
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: err.message });
        }
    });


// Get all events
router.get('/api/events', async (req, res) => {
    try {
        const events = await EVENT.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single event
router.get('/api/event/:id', async (req, res) => {
    try {
        const event = await EVENT.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an event
router.put('/api/event/:id', async (req, res) => {
    try {
        const event = await EVENT.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an event
router.delete('/api/event/:id', async (req, res) => {
    try {
        const event = await EVENT.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;