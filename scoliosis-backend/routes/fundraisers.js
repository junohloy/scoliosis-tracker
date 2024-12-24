const express = require('express');
const router = express.Router();
const Fundraiser = require('../models/fundraiser');

// Get all fundraisers
router.get('/', async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find();
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new fundraiser
router.post('/', async (req, res) => {
  const { name, description, goalAmount } = req.body;
  try {
    const newFundraiser = new Fundraiser({ name, description, goalAmount });
    await newFundraiser.save();
    res.status(201).json(newFundraiser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
