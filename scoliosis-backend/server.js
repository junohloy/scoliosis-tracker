const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Fundraiser Schema and Model
const fundraiserSchema = new mongoose.Schema({
  name: String,
  goal: Number,
  currentAmount: { type: Number, default: 0 },
  description: String,
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Scoliosis Tracker API!');
});

// Fundraiser Routes

// Get all fundraisers
app.get('/api/fundraisers', async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find();
    res.json(fundraisers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch fundraisers' });
  }
});

// Create a new fundraiser
app.post('/api/fundraisers', async (req, res) => {
  const { name, goal, description } = req.body;

  try {
    const newFundraiser = new Fundraiser({ name, goal, description });
    await newFundraiser.save();
    res.status(201).json(newFundraiser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create fundraiser' });
  }
});

// Donate to a fundraiser
app.put('/api/fundraisers/:id/donate', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const fundraiser = await Fundraiser.findById(id);
    if (!fundraiser) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    fundraiser.currentAmount += amount;
    await fundraiser.save();
    res.json(fundraiser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to donate to fundraiser' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


