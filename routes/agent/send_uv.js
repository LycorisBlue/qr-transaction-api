const express = require('express');
const router = express.Router();
const { Agent, Client, Transaction } = require('../../models');
const { verifyRequestData } = require('../../config/utils');
const { authenticate } = require('../../middlewares/auth');

router.post('/', authenticate(), async (req, res) => {
  const required = ["client_id", "amount"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { client_id, amount } = req.body;
    const agent_id = req.user.id; // Utiliser l'ID de l'agent authentifié

    // Trouver l'agent
    const agent = await Agent.findByPk(agent_id);
    if (!agent) {
      return res.status(404).json({ error: "Agent non trouvé" });
    }

    // Trouver le client
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Convertir les valeurs en nombres flottants
    const agentCurrentBalance = parseFloat(agent.solde);
    const transferAmount = parseFloat(amount);

    // Vérifier le solde de l'agent
    if (agentCurrentBalance < transferAmount) {
      return res.status(400).json({ error: "Solde insuffisant de l'agent" });
    }

    // Mettre à jour les soldes
    agent.solde = agentCurrentBalance - transferAmount;
    await agent.save();

    const clientCurrentBalance = parseFloat(client.solde);
    client.solde = clientCurrentBalance + transferAmount;
    await client.save();

    // Vérification du calcul
    console.log(`Agent - Ancien solde: ${agentCurrentBalance}, Montant à débiter: ${transferAmount}, Nouveau solde: ${agent.solde}`);
    console.log(`Client - Ancien solde: ${clientCurrentBalance}, Montant à ajouter: ${transferAmount}, Nouveau solde: ${client.solde}`);

    // Créer une transaction
    const transaction = await Transaction.create({
      type: 'agent_to_client',
      amount: transferAmount,
      sender_id: agent_id,
      recipient_id: client_id,
      date: new Date()
    });

    res.status(201).json({
      message: "UVs envoyés avec succès au client",
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
