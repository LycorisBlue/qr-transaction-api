const express = require('express');
const router = express.Router();
const { Transaction, Client } = require('../../models');
const { authenticate } = require('../../middlewares/auth');

router.get('/', authenticate(), async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { agent_id: req.user.id },
      include: [
        { model: Client, as: 'sender', attributes: ['id', 'nom', 'email'] },
        { model: Client, as: 'recipient', attributes: ['id', 'nom', 'email'] }
      ]
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
