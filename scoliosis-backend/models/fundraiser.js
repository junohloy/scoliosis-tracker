const mongoose = require('mongoose');

const FundraiserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Fundraiser', FundraiserSchema);
