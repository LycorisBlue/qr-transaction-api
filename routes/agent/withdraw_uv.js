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

    // Trouver le client
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Vérifier si le client a suffisamment de solde
    const clientCurrentBalance = parseFloat(client.solde);
    const withdrawAmount = parseFloat(amount);
    if (clientCurrentBalance < withdrawAmount) {
      return res.status(400).json({ error: "Solde insuffisant du client" });
    }

    // Mettre à jour le solde du client
    client.solde = clientCurrentBalance - withdrawAmount;
    await client.save();

    // Trouver l'agent
    const agent = await Agent.findByPk(agent_id);
    if (!agent) {
      return res.status(404).json({ error: "Agent non trouvé" });
    }

    // Mettre à jour le solde de l'agent
    const agentCurrentBalance = parseFloat(agent.solde);
    agent.solde = agentCurrentBalance + withdrawAmount;
    await agent.save();

    // Vérification du calcul
    console.log(`Client - Ancien solde: ${clientCurrentBalance}, Montant à débiter: ${withdrawAmount}, Nouveau solde: ${client.solde}`);
    console.log(`Agent - Ancien solde: ${agentCurrentBalance}, Montant à ajouter: ${withdrawAmount}, Nouveau solde: ${agent.solde}`);

    // Créer une transaction
    const transaction = await Transaction.create({
      type: 'client_to_agent',
      amount: withdrawAmount,
      sender_id: client_id,
      recipient_id: agent_id,
      date: new Date()
    });

    res.status(201).json({
      message: "UVs retirés avec succès du client et transférés à l'agent",
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
