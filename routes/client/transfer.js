const express = require('express');
const router = express.Router();
const { Client, Transaction } = require('../../models');
const { verifyRequestData } = require('../../config/utils');
const { authenticate } = require('../../middlewares/auth');

router.post('/', authenticate(), async (req, res) => {
  const required = ["recipient_phone", "amount"];
  const verify = verifyRequestData(req.body, required);

  if (!verify.isValid) {
    return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
  }

  try {
    const { recipient_phone, amount } = req.body;
    const sender_id = req.user.id; // Utiliser l'ID de l'utilisateur authentifié

    // Convertir le montant en nombre flottant
    const transferAmount = parseFloat(amount);

    // Trouver l'expéditeur
    const sender = await Client.findByPk(sender_id);
    if (!sender) {
      return res.status(404).json({ error: "Expéditeur non trouvé" });
    }

    // Vérifier le solde de l'expéditeur
    if (parseFloat(sender.solde) < transferAmount) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    // Trouver le destinataire par son numéro de téléphone
    const recipient = await Client.findOne({ where: { numero: recipient_phone } });
    if (!recipient) {
      return res.status(404).json({ error: "Destinataire non trouvé" });
    }

    // Calculer les frais (1% du montant)
    const fees = transferAmount * 0.01;
    const totalAmount = transferAmount + fees;

    // Mettre à jour le solde de l'expéditeur et du destinataire
    sender.solde = parseFloat(sender.solde) - totalAmount;
    recipient.solde = parseFloat(recipient.solde) + transferAmount;

    // Vérification des calculs
    console.log(`Expéditeur - Ancien solde: ${parseFloat(sender.solde) + totalAmount}, Montant à débiter: ${totalAmount}, Nouveau solde: ${sender.solde}`);
    console.log(`Destinataire - Ancien solde: ${parseFloat(recipient.solde) - transferAmount}, Montant à ajouter: ${transferAmount}, Nouveau solde: ${recipient.solde}`);

    await sender.save();
    await recipient.save();

    // Créer une transaction
    const transaction = await Transaction.create({
      type: 'transfer',
      amount: transferAmount,
      sender_id: sender_id,
      recipient_id: recipient.id,
      date: new Date()
    });

    res.status(201).json({
      message: "Transfert effectué avec succès",
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
