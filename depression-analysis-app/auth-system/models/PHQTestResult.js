const mongoose = require('mongoose');

const phqTestResultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PHQTestResult', phqTestResultSchema);
