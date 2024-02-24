const express = require('express')
const mongoose = require('mongoose')
const COMMITTEE = mongoose.model('COMMITTEE')
const router = express.Router()


router.post('/api/create-committee', async (req, res) => {
    try {
      const { committee_name, committee_desc } = req.body;
  
      const committee = new Committee({
        committee_name,
        committee_desc
      });
  
      const newCommittee = await committee.save();
      res.status(201).json(newCommittee);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

router.put('/api/update-committee/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let committee = await Committee.findById(id);
  
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
  

module.exports = router
