// routes/webhook.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/logs', (req, res) => {
  const logPath = path.join(__dirname, '../logs/freshdesk-events.log');

  if (fs.existsSync(logPath)) {
    const logs = fs.readFileSync(logPath, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (err) {
          return { error: 'Invalid JSON', line };
        }
      });

    res.json(logs);
  } else {
    res.json([]);
  }
});

module.exports = router;
