const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const router = express.Router()


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
        console.log(newCommittee)
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

router.post('/api/subscribe', async(req, res)=>{
    const {user_id, committee_id }= req.body
    try{
        const push_subscriber = COMMITTEE.findByIdAndUpdate(committee_id, {
            $push: {subscribers:user_id}
        }, {new: true})
        res.status(200).json({message: "Subscribed"})
    }catch (err){
        res.status(500).json({ message: err.message })
    }
})




module.exports = router
