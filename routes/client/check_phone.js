const express = require('express');
const router = express.Router();
const { Client } = require('../../models');

router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    // Vérifier si le numéro de téléphone existe
    const client = await Client.findOne({ where: { numero: phone } });
    if (client) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
