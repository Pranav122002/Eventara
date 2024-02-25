const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const USER = mongoose.model('USER')
const ADMIN = mongoose.model('ADMIN')
const router = express.Router()
const generatePDFFromCommittee = require("../functions/genPDF")

router.post('/api/create-committee', async (req, res) => {
    try {
        var committee_info = req.body.formData;
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

        //push the committee id to admins' assigned_committees.
        const updatedAdmin =  await Promise.all(approvals.map(async(admin)=>{
            try{
                const admin_update = await ADMIN.findByIdAndUpdate(admin.user, {
                    $push: {'admin.assigned_committees': committee._id}
                },{ new: true })
                console.log(admin_update.phone_no)
                await generatePDFFromCommittee(committee, admin_update.phone_no)
            }catch(err){
                console.error("Error updating admin:", err);
            }
            
            // Send PDF to admin
            // generate PDF
           
            // send that PDF to amdin

            
        }))


        // console.log(newCommittee)
        console.log(updatedAdmin)
        res.status(201).json(newCommittee);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
});

router.put('/api/update-committee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let committee = await COMMITTEE.findById(id);

        if (!committee) {
            return res.status(404).json({ message: "Committee not found" });
        }

        for (let key in req.body) {
            committee[key] = req.body[key];
        }
        const updatedCommittee = await committee.save();
        res.json(updatedCommittee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/api/all-committees', async (req, res) => {
    try {
        const committees = await COMMITTEE.find()
            .populate('members', 'name')
            .select('committee_desc committee_name')
        res.json(committees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/api/subscribe', async (req, res) => {
    const { user_id, committee_id } = req.body
    try {
        const push_subscriber = await COMMITTEE.findByIdAndUpdate(committee_id, {
            $push: { subscribers: user_id }
        }, { new: true })
        res.status(200).json({ message: "Subscribed" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/api/my-committees/:id', async (req, res) => {

    const user_id = req.params.id
    try {
        const committees = await COMMITTEE.find({ committee_head: user_id })
            .populate({
                path: 'approvals.user',
                select: 'name'
            })
        console.log(committees)
        res.status(200).json(committees)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/api/committee-approval/:id', async (req, res) => {
    const committee_id = req.params.id
    const admin_id = req.body.admin_id
    const status = req.body.status;

    try {

        let updateObj = {
            $set: {
                "approvals.$[elem].status": status
            }
        };

        if (status === 'rejected') {
            updateObj.$set.approval_status = 'rejected';
        }

        const updatedCommittee = await COMMITTEE.findByIdAndUpdate(committee_id, updateObj, {
            arrayFilters: [{ "elem.user": admin_id }]
        });

        if (!updatedCommittee) {
            return res.status(404).json({ message: "Committee not found." });
        }

        res.status(200).json({ message: "Committee approval status updated successfully." });

    } catch (err) {

    }
})

router.post('/api/event-approval/:id', async (req, res) => {
    const event_id = req.params.id;
    const admin_id = req.body.admin_id;
    const status = req.body.status;

    try {
        let updateObj = {
            $set: {
                "approvals.$[elem].status": status
            }
        };
        if (status === 'rejected') {
            updateObj.$set.approval_status = 'rejected';
        }
        const updatedEvent = await EVENT.findByIdAndUpdate(event_id, updateObj, {
            arrayFilters: [{ "elem.user": admin_id }]
        });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json({ message: "Event approval status updated successfully." });

    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
});


module.exports = router
