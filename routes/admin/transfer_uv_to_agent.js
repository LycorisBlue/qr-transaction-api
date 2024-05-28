const express = require('express');
const router = express.Router();
const { Admin, Agent, UV, Transaction } = require('../../models');
const { verifyRequestData } = require('../../config/utils');

router.post('/', async (req, res) => {
  const required = ["agent_id", "amount"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { agent_id, amount } = req.body;
    const transferAmount = parseFloat(amount);

    // Trouver l'agent
    const agent = await Agent.findByPk(agent_id);
    if (!agent) {
      return res.status(404).json({ error: "Agent non trouvé" });
    }

    // Vérifier les UVs en stock
    const uvStock = await UV.findByPk(1);
    if (!uvStock) {
      return res.status(404).json({ error: "Stock d'UVs non trouvé" });
    }

    const uvValue = parseFloat(uvStock.value);

    if (uvValue < transferAmount) {
      return res.status(400).json({ error: "Stock d'UVs insuffisant" });
    }

    // Convertir les valeurs en nombres flottants avant l'addition
    const agentCurrentBalance = parseFloat(agent.solde);
    agent.solde = agentCurrentBalance + transferAmount;

    // Mettre à jour le solde de l'agent
    await agent.save();

    // Mettre à jour le stock d'UVs
    uvStock.value = uvValue - transferAmount;
    await uvStock.save();

    // Créer une transaction
    const transaction = await Transaction.create({
      type: 'admin_to_agent',
      amount: transferAmount,
      agent_id: agent_id,
      date: new Date()
    });

    res.status(201).json({
      message: "UVs transférés avec succès à l'agent",
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
