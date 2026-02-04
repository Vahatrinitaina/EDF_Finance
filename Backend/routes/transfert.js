// routes/transfers.js
const express = require('express');
const router = express.Router();
const { transfer } = require('../controllers/transfersController');

// Route POST pour effectuer un transfert interne
router.post('/', transfer); // pas de middleware auth pour l'instant

module.exports = router;
