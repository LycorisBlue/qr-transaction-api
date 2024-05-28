const express = require('express');
const router = express.Router();
const { Agent } = require('../../models');
const { authenticate } = require('../../middlewares/auth');

router.get('/', authenticate(), async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.user.id, { attributes: ['solde'] });
    if (!agent) {
      return res.status(404).json({ error: "Agent non trouvé" });
    }
    res.status(200).json({ balance: agent.solde });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
