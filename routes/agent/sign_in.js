const express = require('express');
const router = express.Router();
const { Agent, Token } = require('../../models');
const { generateToken, verifyRequestData } = require("../../config/utils");
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const required = ["email", "mot_de_passe"];
  const verify = verifyRequestData(req.body, required);
  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { email, mot_de_passe } = req.body;
    const agent = await Agent.findOne({ where: { email } });
    if (!agent) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, agent.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    }

    const token = await generateToken(agent, "AGENT");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);
    const save_token = await Token.create({
      token,
      user_id: agent.id,
      user_type: "AGENT",
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
