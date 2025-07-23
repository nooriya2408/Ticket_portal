const express = require('express');
const router = express.Router();

router.post('/freshdesk-webhook', (req, res) => {
  console.log('Freshdesk Webhook received:', req.body);
  res.status(200).send('Webhook received!');
});

module.exports = router;
