const express = require('express');
const router = express.Router();

const service = 'agent';

// Routes spécifiques
const new_agent = require('../routes/' + service + '/new_agent');
const sign_in = require('../routes/' + service + '/sign_in');
const send_uv = require('../routes/' + service + '/send_uv');
const withdraw_uv = require('../routes/' + service + '/withdraw_uv');
const deposit = require('../routes/' + service + '/deposit');
const create_client = require('../routes/' + service + '/create_client');
const balance = require('../routes/' + service + '/balance');
const transactions = require('../routes/' + service + '/transactions');

router.use('/new_agent', new_agent);
router.use('/sign_in', sign_in);
router.use('/send_uv', send_uv);
router.use('/withdraw_uv', withdraw_uv);
router.use('/deposit', deposit);
router.use('/create_client', create_client);
router.use('/balance', balance);
router.use('/transactions', transactions);

module.exports = router;
