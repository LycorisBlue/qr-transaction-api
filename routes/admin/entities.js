const express = require('express');
const router = express.Router();
const { Client, Agent } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const clients = await Client.findAll({ attributes: ['id', 'nom', 'solde', 'email'] });
    const agents = await Agent.findAll({ attributes: ['id', 'nom', 'solde', 'email'] });

    res.status(200).json({
      clients,
      agents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
