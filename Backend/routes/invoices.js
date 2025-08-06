const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// GET - toutes les factures
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM invoices');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des factures.' });
  }
});

// POST - créer une nouvelle facture
router.post('/', async (req, res) => {
  const { client_id, amount, date } = req.body;

  if (!client_id || !amount || !date) {
    return res.status(400).json({ error: 'Champs requis : client_id, amount, date.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO invoices (client_id, amount, date) VALUES (?, ?, ?)',
      [client_id, amount, date]
    );
    res.status(201).json({ id: result.insertId, message: 'Facture créée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la facture.' });
  }
});

// PUT - mise à jour d'une facture
router.put('/:id', async (req, res) => {
  const invoiceId = req.params.id;
  const { client_id, amount, date } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE invoices SET client_id = ?, amount = ?, date = ? WHERE id = ?',
      [client_id, amount, date, invoiceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Facture non trouvée.' });
    }

    res.json({ message: 'Facture mise à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la facture.' });
  }
});

// DELETE - suppression d'une facture
router.delete('/:id', async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM invoices WHERE id = ?',
      [invoiceId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Facture non trouvée.' });
    }

    res.json({ message: 'Facture supprimée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture.' });
  }
});

module.exports = router;
