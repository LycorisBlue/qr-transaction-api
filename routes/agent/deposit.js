const express = require('express');
const router = express.Router();
const { Agent, Client, Transaction } = require('../../models');
const { verifyRequestData } = require('../../config/utils');

router.post('/', async (req, res) => {
  const required = ["client_id", "amount"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { client_id, amount } = req.body;

    // Trouver le client
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Mettre à jour le solde du client
    client.solde += parseFloat(amount);
    await client.save();

    // Créer une transaction
    const transaction = await Transaction.create({
      type: 'deposit',
      amount: parseFloat(amount),
      recipient_id: client_id,
      agent_id: req.user.id, // ID de l'agent connecté
      date: new Date()
    });

    res.status(201).json({
      message: "Dépôt effectué avec succès",
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
