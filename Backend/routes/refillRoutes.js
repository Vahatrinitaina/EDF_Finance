const express = require('express');
const router = express.Router();
const { addRefill, getRefills } = require('../controllers/refillController');

// Ajouter des fonds
router.post('/', addRefill);

// Voir tous les renflouements (admin)
router.get('/', getRefills);

module.exports = router;
