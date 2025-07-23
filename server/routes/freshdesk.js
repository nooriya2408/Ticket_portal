// routes/freshdesk.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN;
const FRESHDESK_API_KEY = process.env.FRESHDESK_API_KEY;
 // replace with your real API key
const authHeader = {
  headers: {
    Authorization: `Basic ${Buffer.from(FRESHDESK_API_KEY + ":X").toString("base64")}`,
  },
};
router.get('/tickets', async (req, res) => {
  try {
    const response = await axios.get(`https://${FRESHDESK_DOMAIN}/api/v2/tickets`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(FRESHDESK_API_KEY + ':X').toString('base64')
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Freshdesk error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tickets from Freshdesk' });
  }
});
// Get contact details from Freshdesk using requester_id
router.get('/contacts/:id', async (req, res) => {
  const contactId = req.params.id;

  try {
    const response = await axios.get(`https://${FRESHDESK_DOMAIN}/api/v2/contacts/${contactId}`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(FRESHDESK_API_KEY + ':X').toString('base64')
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Freshdesk contact fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});
router.get("/contacts", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email query param is required" });
  }

  try {
    const url = `https://${FRESHDESK_DOMAIN}/api/v2/search/contacts?query="email:'${email}'"`;

    const response = await axios.get(url, authHeader);
    const contacts = response.data.results;

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: "No contact found for that email" });
    }

    return res.json(contacts[0]); // return the first contact
  } catch (error) {
    console.error("Error fetching contact by email:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch contact from Freshdesk" });
  }
});


router.get('/ticket/:id/conversations', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://${FRESHDESK_DOMAIN}/api/v2/tickets/${id}/conversations`,
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(FRESHDESK_API_KEY + ':X').toString('base64'),
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching conversations:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch conversations from Freshdesk' });
  }
});
router.post('/ticket/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { body, user_id } = req.body;

  try {
    const response = await axios.post(
      `https://${FRESHDESK_DOMAIN}/api/v2/tickets/${id}/reply`,
      { body, user_id },
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(FRESHDESK_API_KEY + ':X').toString('base64'),
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error posting reply:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to post reply to Freshdesk ticket' });
  }
});


module.exports = router;
