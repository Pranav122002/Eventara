const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const USER = mongoose.model('USER')
const ADMIN = mongoose.model('ADMIN')
const EVENT = mongoose.model('EVENT')
const router = express.Router()
const generatePDFFromCommittee = require("../functions/genPDF")
const sendWhatsAppMessage = require('../functions/sendWhatsAppMessage')
const generatePDFCommittee = require('../functions/generatePDFCommittee')
const updatePDF = require('../functions/updatePDF')
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
            .populate('members', 'name')
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

    console.log("Committe Approval")
    try {
        const committee = await COMMITTEE.findById(committee_id);
        if (!committee) {
            return res.status(404).json({ message: 'Committee not found' });
        }

        const approvalIndex = committee.approvals.findIndex(approval => approval.user.toString() === admin_id);
        if (approvalIndex === -1) {
            return res.status(404).json({ message: 'Approval not found for the user' });
        }

        committee.approvals[approvalIndex].status = status;
        if (status === 'rejected') {
            committee.approval_status = 'rejected';
        }
        await committee.save();
        res.json({ message: 'Approval status updated successfully' });


        // delete the committee id after rejecting or accepting 
        // await ADMIN.findByIdAndUpdate(
        //     admin_id,
        //     { $pull: { 'admin.assigned_committees': committee_id } }
        // )
        //Update PDF -- Download the PDF, Add the signature and name, again upload and update the sign_url
        updatePDF(committee_id, admin_id)
    } catch (err) {
        console.log(err)
    }
})

router.get('/api/committee-pdf/:id', async(req , res)=>{
    const committee_id = req.params.id
    try {
        const committee = await COMMITTEE.findById(committee_id)
        res.status(200).json(committee.pdf)
    }catch(err){
        res.status(500).json({message: err})
        console.log(err)
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

router.post('/api/whatsapp-approvals', async (req, res) => {
    const data = req.body
    let isEvent
    var [isEvenisCom, com_eve_name, obtainedStatus, admin_name] = data.Body.split("\n");
    const admin_phone = data.From.slice(9);
    obtainedStatus = obtainedStatus.toLowerCase()
    let data_
    if (isEvenisCom.toLowerCase() == "event") {
        data_ = await EVENT.findOne({ name: com_eve_name })
        isEvent = true
    } else {
        data_ = await COMMITTEE.findOne({ committee_name: com_eve_name })
        isEvent = false
    }
    console.log(isEvenisCom)
    console.log(com_eve_name)
    console.log(obtainedStatus)
    console.log(admin_name)
    console.log(data_)

    try {

        const admin = await ADMIN.findOne({ name: admin_name })

        const msg = `The ${com_eve_name} is ${obtainedStatus}`
        await sendWhatsAppMessage(admin_phone, msg)

        if (!isEvent) {
            const committee = await COMMITTEE.findOne({ committee_name: committee_name });
            console.log(committee)
            if (!committee) {
                return res.status(404).json({ error: "Committee not found" });
            }

            console.log(committee.approvals.find())
            const approval = committee.approvals.find(approval => approval.user.toString() === admin._id);
            console.log(approval)
            if (!approval) {
                return res.status(404).json({ error: "Approval not found" });
            }
            approval.status = obtainedStatus;
            await committee.save();
            res.json({ message: "Approval status updated successfully", committee });

            console.log(committee)
        }
        // console.log(admin._id)


    } catch (err) {

    }
})

module.exports = router
