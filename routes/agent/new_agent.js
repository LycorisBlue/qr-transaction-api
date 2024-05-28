const express = require('express');
const router = express.Router();
const { Agent } = require('../../models');
const { verifyRequestData } = require('../../config/utils');

router.post('/', async (req, res) => {
  const required = ["nom", "email", "numero", "mot_de_passe"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { nom, email, numero, mot_de_passe } = req.body;
    const agent = await Agent.create({ nom, email, numero, mot_de_passe });
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
