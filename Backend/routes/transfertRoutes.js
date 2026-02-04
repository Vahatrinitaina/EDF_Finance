const express = require('express');
const router = express.Router();
const { transferMoney, getTransfers } = require('../controllers/transferController');

// Route pour effectuer un transfert
router.post('/transfer', transferMoney);

// Route pour récupérer l'historique des transferts (admin)
router.get('/transfers', getTransfers);

module.exports = router;
