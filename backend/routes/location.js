const express = require('express');
const Location = require('../models/location');
const {v4 : uuidv4} = require('uuid')

const router = express.Router();

router.post('/user-location', async (req, res) => {
    try {
        const { country, province, city, streetaddress, postalcode, userId } = req.body;

        let existingUserLocation = await Location.findOne({ userId });

        if (existingUserLocation) {
            existingUserLocation.country = country;
            existingUserLocation.province = province;
            existingUserLocation.city = city;
            existingUserLocation.streetaddress = streetaddress;
            existingUserLocation.postalcode = postalcode;

            await existingUserLocation.save();
            return res.json({ success: true, message: 'Location updated' });
        } else {
            const newLocation = new Location({
                _id: uuidv4(),
                country,
                province,
                city,
                streetaddress,
                postalcode,
                userId,
            });
            await newLocation.save();
            return res.json({ success: true, message: 'Location created' });
        }
    } catch (err) {
        console.error('Failed to update or create location', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Retrieve location by userId
router.get('/user-location/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const location = await Location.findOne({ userId });

    if (!location) {
      return res.json({ success: false, message: 'No location found' });
    }

    res.json({ success: true, location });
  } catch (err) {
    console.error('Failed to fetch location', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router