const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ GET /api/clients - récupérer tous les clients
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(results);
    console.log(`✅ Clients récupérés avec succès :`, results);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des clients:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET /api/clients/:id - récupérer un client par ID
router.get('/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [clientId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du client :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ POST /api/clients - ajouter un nouveau client
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le nom du client est obligatoire' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO clients (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    res.status(201).json({ message: 'Client ajouté', clientId: result.insertId });
  } catch (err) {
    console.error('❌ Erreur lors de l\'insertion du client:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ PUT /api/clients/:id - mettre à jour un client
router.put('/:id', async (req, res) => {
  const clientId = req.params.id;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Le nom et la description sont requis.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE clients SET name = ?, description = ? WHERE id = ?',
      [name, description, clientId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }

    res.json({ message: 'Client mis à jour.' });
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour du client :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ DELETE /api/clients/:id - supprimer un client
router.delete('/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [clientId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }

    res.json({ message: 'Client supprimé.' });
  } catch (err) {
    console.error('❌ Erreur lors de la suppression du client :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
