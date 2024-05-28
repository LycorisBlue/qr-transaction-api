const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('../models')
const { Token } = require('../models');


class Utils {

    static getModel() {
        return model
    }

    static generateCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 50; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static isInteger(data) {
        // Vérifie si la donnée est de type 'number' et est un entier
        return typeof data === 'number' && isFinite(data) && Math.floor(data) === data;
    }

    static isEmail(data) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(data);
    }

    static isString(data) {
        return typeof data === 'string';
    }

    static verifyRequestData(body, requiredFields) {
        const missingFields = requiredFields.filter(field => !body.hasOwnProperty(field) || body[field] === undefined || body[field] === '');
      
        if (missingFields.length > 0) {
          // Retourne false et la liste des champs manquants si certains champs sont absents
          return { isValid: false, missingFields };
        }
      
        // Retourne true si tous les champs sont présents
        return { isValid: true };
    }

    static verifyRequestDataForUpdate(body, allowedFields) {
        const invalidFields = Object.keys(body).filter(field => !allowedFields.includes(field));
      
        if (invalidFields.length > 0) {
          // Retourne false et la liste des champs non autorisés si des champs non désirés sont présents
          return { isValid: false, invalidFields };
        }
      
        // Retourne true si aucun champ non autorisé n'est présent
        return { isValid: true };
    }

    static normalizeSpaces(str) {
        return str.replace(/\s+/g, ' ');
    }

    static async cryptWithBcrypt(word) {
        const saltRounds = 10;
        try {
          const hashedPassword = await bcrypt.hash(word, saltRounds);
          return hashedPassword;
        } catch (error) {
          console.error('Erreur lors du hachage du mot de passe:', error);
          return null;
        }
    }

    static async compareWithBcrypt(word, hashWord) {
        try {
          const match = await bcrypt.compare(word, hashWord);
          return match; // Retourne true si les mots de passe correspondent, sinon false
        } catch (error) {
          console.error('Erreur lors de la vérification du mot de passe:', error);
          return false;
        }
    }

    static async generateToken (user, userType) {
        const token = jwt.sign({ id: user.id, type: userType }, '2RETUVVQFBXA1N5BNBUK59FYKSJGLT4C6Z2FZJIOEX4S6VFDJ0LXDQ5KO5YBFH31', { expiresIn: '1h' });
        return token;
      };
}

module.exports = Utils