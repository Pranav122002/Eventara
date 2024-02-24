const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const router = express.Router()


router.post('/api/create-committee', async (req, res) => {
    try {
        const committee_info = req.body;
        console.log(committee_info)
        const committee = new COMMITTEE(committee_info);

        const newCommittee = await committee.save();
        console.log(newCommittee)
        res.status(201).json(newCommittee);
    } catch (err) {
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
  

module.exports = router
