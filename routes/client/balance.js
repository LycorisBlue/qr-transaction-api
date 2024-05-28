const express = require('express');
const router = express.Router();
const { Client } = require('../../models');
const { authenticate } = require('../../middlewares/auth');

router.get('/', authenticate(), async (req, res) => {
  try {
    const client = await Client.findByPk(req.user.id, { attributes: ['solde'] });
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.status(200).json({ balance: client.solde });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
