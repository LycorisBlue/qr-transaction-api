const express = require('express');
const router = express.Router();
const { Transaction, Client, Agent } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: Client, as: 'sender', attributes: ['id', 'nom', 'email'] },
        { model: Client, as: 'recipient', attributes: ['id', 'nom', 'email'] },
        { model: Agent, as: 'agent', attributes: ['id', 'nom', 'email'] }
      ]
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
