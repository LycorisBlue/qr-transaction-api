const express = require('express');
const router = express.Router();

const service = 'client';

// Routes spécifiques
const new_client = require('../routes/' + service + '/new_client');
const sign_in = require('../routes/' + service + '/sign_in');
const transfer = require('../routes/' + service + '/transfer');
const balance = require('../routes/' + service + '/balance');
const transactions = require('../routes/' + service + '/transactions');
const info_via_qr = require('../routes/' + service + '/info_via_qr');
const check_phone = require('../routes/' + service + '/check_phone');

router.use('/new_client', new_client);
router.use('/sign_in', sign_in);
router.use('/transfer', transfer);
router.use('/balance', balance);
router.use('/transactions', transactions);
router.use('/info_via_qr', info_via_qr);
router.use('/check_phone', check_phone);

module.exports = router;
