const express = require('express');
const mongoose = require('mongoose')
const BOOKING = mongoose.model('BOOKING')
const ROOM = mongoose.model('ROOM')
const router = express.Router();

// Route to get the list of rooms booked at a particular date and time
router.get('/api/bookings', async (req, res) => {
    try {
        // Extract date and time parameters from the request
        const { date, time } = req.query;

        // Parse date and time strings to JavaScript Date objects
        const bookings = BOOKING.find({
            date: { $eq: new Date(date) }, // Use the date provided in the request body
            start_time: { $lte: req.body.start_time },
            end_time: { $gte: req.body.start_time }
        })

        // Extract the room_id values from the matching bookings
        const bookedRoomIds = bookings.map(booking => booking.room_id);

        // Query the ROOM collection to retrieve details of the booked rooms
        const bookedRooms = await ROOM.find({ _id: { $in: bookedRoomIds } });

        // Return the list of booked rooms as the response
        res.json(bookedRooms);
    } catch (error) {
        console.error('Error retrieving booked rooms:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/rooms', async(req, res)=>{
    try {  
        const rooms = await ROOM.find()
        console.log(rooms)
        res.status(200).json(rooms)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

module.exports = router;
