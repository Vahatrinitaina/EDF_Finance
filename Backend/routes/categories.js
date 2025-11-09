const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - toutes les catégories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

// POST - créer une nouvelle catégorie
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la catégorie est requis.' });
  }

  try {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, message: 'Catégorie créée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la catégorie.' });
  }
});

// PUT - modifier une catégorie
router.put('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la catégorie est requis.' });
  }

  try {
    const [result] = await pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }
    res.json({ message: 'Catégorie mise à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie.' });
  }
});

// DELETE - supprimer une catégorie
router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }
    res.json({ message: 'Catégorie supprimée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie.' });
  }
});

module.exports = router;
