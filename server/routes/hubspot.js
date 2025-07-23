const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/contact', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
        properties: ['firstname', 'lastname', 'email', 'phone', 'lifecyclestage', 'company'],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const results = response.data.results;
    if (results.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(results[0]);

  } catch (error) {
    console.error('HubSpot error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch contact from HubSpot' });
  }
});

module.exports = router;
