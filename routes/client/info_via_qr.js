const express = require('express');
const router = express.Router();
const { Client } = require('../../models');
const { authenticate } = require('../../middlewares/auth');

router.get('/:qr', authenticate(), async (req, res) => {
  try {
    const { qr } = req.params;
    
    // Trouver le client par les données du QR
    const client = await Client.findOne({ where: { qr } });
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Renvoyer les informations du client
    res.status(200).json({
      id: client.id,
      nom: client.nom,
      email: client.email,
      numero: client.numero,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
