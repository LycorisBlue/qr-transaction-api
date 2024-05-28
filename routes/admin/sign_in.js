const express = require('express');
const router = express.Router();
const { Admin, Token } = require('../../models');
const { generateToken, verifyRequestData } = require("../../config/utils")

const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    const required = ["email", "mot_de_passe"];
    const verify = verifyRequestData(req.body, required);
    if (!verify.isValid) {
        return res.status(400).json({ error: "Champs requis manquants", missingFields: verify.missingFields });
    }


    try {
        const { email, mot_de_passe } = req.body;
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(400).json({ error: 'Email ou mot de passe invalide' });
        }

        const isMatch = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou mot de passe invalide' });
        }

        const token = await generateToken(admin, "ADMIN");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 20);
        const save_token = await Token.create({
            token,
            user_id: admin.id,
            user_type: "ADMIN",
            expires_at: expiresAt
          });

        if(!save_token){
            return res.status(500).json({ error: 'Erreur lors de la création du TOKEN' });
        }
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
