const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - récupérer toutes les dépenses
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT expenses.*, users.name AS user_name, clients.name AS client_name, categories.name AS category_name
       FROM expenses
       JOIN users ON expenses.user_id = users.id
       JOIN clients ON expenses.client_id = clients.id
       JOIN categories ON expenses.category_id = categories.id
       ORDER BY expenses.date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des dépenses.' });
  }
});

// GET - récupérer une dépense par ID
router.get('/:id', async (req, res) => {
  const expenseId = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT expenses.*, users.name AS user_name, clients.name AS client_name, categories.name AS category_name
       FROM expenses
       JOIN users ON expenses.user_id = users.id
       JOIN clients ON expenses.client_id = clients.id
       JOIN categories ON expenses.category_id = categories.id
       WHERE expenses.id = ?`,
      [expenseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dépense non trouvée.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la dépense.' });
  }
});

// POST - créer une nouvelle dépense
router.post('/', async (req, res) => {
  const { user_id, client_id, category_id, description, amount, date } = req.body;

  if (!user_id || !client_id || !category_id || !amount || !date) {
    return res.status(400).json({ error: 'Champs requis : user_id, client_id, category_id, amount, date.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO expenses (user_id, client_id, category_id, description, amount, date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, client_id, category_id, description || null, amount, date]
    );
    res.status(201).json({ id: result.insertId, message: 'Dépense créée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la dépense.' });
  }
});

// PUT - mettre à jour une dépense par ID
router.put('/:id', async (req, res) => {
  const expenseId = req.params.id;
  const { user_id, client_id, category_id, description, amount, date } = req.body;

  if (!user_id || !client_id || !category_id || !amount || !date) {
    return res.status(400).json({ error: 'Champs requis : user_id, client_id, category_id, amount, date.' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE expenses
       SET user_id = ?, client_id = ?, category_id = ?, description = ?, amount = ?, date = ?
       WHERE id = ?`,
      [user_id, client_id, category_id, description || null, amount, date, expenseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dépense non trouvée.' });
    }

    res.json({ message: 'Dépense mise à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la dépense.' });
  }
});

// DELETE - supprimer une dépense par ID
router.delete('/:id', async (req, res) => {
  const expenseId = req.params.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM expenses WHERE id = ?',
      [expenseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Dépense non trouvée.' });
    }

    res.json({ message: 'Dépense supprimée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la dépense.' });
  }
});

module.exports = router;
