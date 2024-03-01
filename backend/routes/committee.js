const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const USER = mongoose.model('USER')
const ADMIN = mongoose.model('ADMIN')
const router = express.Router()
const generatePDFFromCommittee = require("../functions/genPDF")
const sendWhatsAppMessage = require('../functions/sendWhatsAppMessage')
const generatePDFCommittee = require('../functions/generatePDFCommittee')
router.post('/api/create-committee', async (req, res) => {
    try {
        var committee_info = req.body.formData;
        // console.log(committee_info)

        var committee_info = req.body.formData;
        const approvals = req.body.selectedAdmins?.map(adminId => ({
            user: adminId,
            status: 'pending'
        }));
        console.log(approvals)
        // const adminWithHighestImp = approvals?.reduce((maxImpAdmin, currentAdmin) => {
        //     return currentAdmin.imp > maxImpAdmin.imp ? currentAdmin : maxImpAdmin;
        // }, approvals[0]);
        committee_info.approvals = approvals
        console.log(committee_info.committee_head)
        const committee = new COMMITTEE(committee_info);

        const newCommittee = await committee.save();
        console.log(newCommittee)
        //push the committee id to admins' assigned_committees.
        const updatedAdmins = await Promise.all(approvals.map(async (admin) => {
            try {
                const admin_update = await ADMIN.findByIdAndUpdate(admin.user, {
                    $push: { 'admin.assigned_committees': committee._id }
                }, { new: true })
                console.log()
                generatePDFCommittee(committee, admin_update.phone_no)
            } catch (err) {
                console.error("Error updating admin:", err);
            }


        }))
        // Find the admin with the highest importance
        const highestImportanceAdmin = updatedAdmins.reduce((prevAdmin, currentAdmin) => {
            return prevAdmin.importance > currentAdmin.importance ? prevAdmin : currentAdmin;
        });

        // Call generatePDFCommittee if the importance of the admin is the highest
        if (highestImportanceAdmin) {
            generatePDFCommittee(committee, highestImportanceAdmin.phone_no);
        }


        // console.log(newCommittee)
        console.log(updatedAdmins)
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
            .populate('members','name')
            .select('committee_desc committee_name committee_image')
        res.json(committees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/api/subscribe', async (req, res) => {
    const { user_id, committee_id } = req.body
    console.log(user_id, committee_id)
    try {
        const push_subscriber = await COMMITTEE.findByIdAndUpdate(
            committee_id,
            { $addToSet: { subscribers: user_id } },
            { new: true }
        );
        res.status(200).json({ message: "Subscribed" })
    } catch (err) {
        console.log(err)
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


        //delete the committee id after rejecting or accepting 
        await ADMIN.updateOne(
            { _id: admin_id },
            { $pull: { assigned_committees: committee_id } }
        )

        res.status(200).json({ message: "Committee approval status updated successfully." })

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

router.post('/api/whatsapp-committee-approvals', async (req, res) => {
    const data = req.body
    //parse the data:
    console.log(data)
    const [admin_name, obtainedStatus, committee_name] = data.Body.split("\n");
    const admin_phone = data.From.slice(9);
    console.log(admin_name, obtainedStatus, committee_name, admin_phone)
    const admin = await ADMIN.findOne({name: admin_name})
    try {

        const msg = `The ${committee_name} is ${obtainedStatus}`
        await sendWhatsAppMessage(admin_phone, msg)

        // console.log(admin._id)
        // const committee = await COMMITTEE.findOne({committee_name: committee_name});
        // console.log(committee)
        // if (!committee) {
        //     return res.status(404).json({ error: "Committee not found" });
        // }

        // console.log(committee.approvals.find())
        // const approval = committee.approvals.find(approval => approval.user.toString() === admin._id);
        // console.log(approval)
        // if (!approval) {
        //     return res.status(404).json({ error: "Approval not found" });
        // }
        // approval.status = obtainedStatus;
        // await committee.save();
        // res.json({ message: "Approval status updated successfully", committee });


    } catch (err) {

    }
})

module.exports = router 