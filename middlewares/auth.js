const jwt = require('jsonwebtoken');
const { Client, Agent, Admin, Token } = require('../models');

const authenticate = () => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
    }

    try {
      // Vérifier le token dans la table Token
      const tokenRecord = await Token.findOne({ where: { token } });
      if (!tokenRecord) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
      }

      // Vérifier si le token est expiré
      if (new Date(tokenRecord.expires_at) < new Date()) {
        return res.status(401).json({ error: 'Token expiré' });
      }

      const decoded = jwt.verify(token, '2RETUVVQFBXA1N5BNBUK59FYKSJGLT4C6Z2FZJIOEX4S6VFDJ0LXDQ5KO5YBFH31');

      // Vérifier le type d'utilisateur et récupérer les informations utilisateur
      let user;
      if (decoded.type === 'CLIENT') {
        user = await Client.findByPk(tokenRecord.user_id);
      } else if (decoded.type === 'AGENT') {
        user = await Agent.findByPk(tokenRecord.user_id);
      } else if (decoded.type === 'ADMIN') {
        user = await Admin.findByPk(tokenRecord.user_id);
      }

      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      // Attacher l'utilisateur à l'objet req
      req.user = user;
      req.userType = decoded.type;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Accès non autorisé' });
    }
  };
};

module.exports = { authenticate };
