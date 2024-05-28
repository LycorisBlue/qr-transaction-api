const express = require('express');
const router = express.Router();
const { UV } = require('../../models');
const { verifyRequestData } = require('../../config/utils');

router.post('/', async (req, res) => {
  const required = ["type", "value"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { type, value } = req.body;
    const uv = await UV.create({ type, value });
    res.status(201).json({
      message: "UV créée avec succès",
      uv
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
