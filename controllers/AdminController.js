const express = require('express');
const router = express.Router();

const service = 'admin';

// Routes spécifiques
const new_admin = require('../routes/' + service + '/new_admin');
const sign_in = require('../routes/' + service + '/sign_in');
const create_uv = require('../routes/' + service + '/create_uv');
const entities = require('../routes/' + service + '/entities');
const transactions = require('../routes/' + service + '/transactions');
const transfer_uv_to_agent = require('../routes/' + service + '/transfer_uv_to_agent');

router.use('/new_admin', new_admin);
router.use('/sign_in', sign_in);
router.use('/create_uv', create_uv);
router.use('/entities', entities);
router.use('/transactions', transactions);
router.use('/transfer_uv_to_agent', transfer_uv_to_agent);


module.exports = router;
