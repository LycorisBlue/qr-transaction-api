const express = require('express');
const router = express.Router();
const { Client } = require('../../models');
const { verifyRequestData } = require('../../config/utils');

router.post('/', async (req, res) => {
  const required = ["nom", "email", "mot_de_passe", "numero"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { nom, email, mot_de_passe, numero } = req.body;
    const client = await Client.create({ nom, email, mot_de_passe, numero });
    res.status(201).json({
      message: "Compte client créé avec succès",
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
