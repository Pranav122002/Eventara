const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const EVENT = mongoose.model('EVENT');

// Create a new event
router.post('/api/create-event', async (req, res) => {
    router.post('/api/create-committee', async (req, res) => {
        try {
            var event_info = req.body.formData;
            // console.log(committee_info)
    
            var committee_info = req.body.formData;
            const approvals = req.body.selectedAdmins?.map(adminId => ({
                user: adminId,
                status: 'pending'
            }));
    
            committee_info.approvals = approvals
            console.log(committee_info.committee_head)
            const committee = new COMMITTEE(committee_info);
    
            const newCommittee = await committee.save();
            console.log(newCommittee)
            //push the committee id to admins' assigned_committees.
            const updatedAdmin = await Promise.all(approvals.map(async (admin) => {
                try {
                    const admin_update = await ADMIN.findByIdAndUpdate(admin.user, {
                        $push: { 'admin.assigned_committees': committee._id }
                    }, { new: true })
                    await generatePDFFromCommittee(committee, admin_update.phone_no)
                } catch (err) {
                    console.error("Error updating admin:", err);
                }
    
    
            }))
    
    
            // console.log(newCommittee)
            console.log(updatedAdmin)
            res.status(201).json(newCommittee);
        } catch (err) {
            console.log(err)
            res.status(400).json({ message: err.message });
        }
    });
    
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await EVENT.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single event
router.get('/:id', async (req, res) => {
    try {
        const event = await EVENT.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an event
router.put('/:id', async (req, res) => {
    try {
        const event = await EVENT.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const event = await EVENT.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
