const express = require('express');
const router = express.Router();
const { Client, Token } = require('../../models');
const { generateToken, verifyRequestData } = require("../../config/utils");
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const required = ["numero", "mot_de_passe"];
  const verify = verifyRequestData(req.body, required);
  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { numero, mot_de_passe } = req.body;
    const client = await Client.findOne({ where: { numero } });
    if (!client) {
      return res.status(400).json({ error: 'numero ou mot de passe invalide' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ error: 'numero ou mot de passe invalide' });
    }

    const token = await generateToken(client, "CLIENT");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);
    const save_token = await Token.create({
      token,
      user_id: client.id,
      user_type: "CLIENT",
      expires_at: expiresAt
    });

    if (!save_token) {
      return res.status(500).json({ error: 'Erreur lors de la création du TOKEN' });
    }
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
