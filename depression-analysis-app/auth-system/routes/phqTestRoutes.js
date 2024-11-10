const express = require('express');
const router = express.Router();
const PHQTestResult = require('../models/PHQTestResult');

// Route to save PHQ-9 test result
router.post('/phq-test', async (req, res) => {
  const { username, userId, score } = req.body;

  try {
    const newResult = new PHQTestResult({ username, userId, score });
    await newResult.save();
    res.status(201).json({ message: 'Test result saved successfully' });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ message: 'Error saving test result', error });
  }
});

module.exports = router;
