// routes/freshdeskWebhook.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/freshdesk-events.log');

// Ensure logs directory exists
const logsDir = path.dirname(logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

router.post('/webhook', (req, res) => {
  console.log('🔥 Webhook endpoint HIT'); // Add this log
  console.log('📩 Webhook body:', JSON.stringify(req.body, null, 2)); // Log body

  try {
    fs.appendFileSync(logFile, JSON.stringify(req.body) + '\n');
    res.status(200).send('✅ Webhook received');
  } catch (err) {
    console.error('Error writing to log file:', err);
    res.status(500).send('❌ Failed to log webhook');
  }
});


module.exports = router;
