const db = require('../config/db');

// ➕ Ajouter des fonds au budget personnel
exports.addRefill = async (req, res) => {
  const { userId, amount, reason } = req.body;

  if (!userId || !amount || !reason) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }

  try {
    // Récupérer l'utilisateur
    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    }

    const user = userRows[0];
    if (user.role !== 'directeur') {
      return res.status(403).json({ success: false, message: 'Seuls les directeurs peuvent ajouter des fonds.' });
    }

    // Mise à jour du budget utilisateur
    await db.query('UPDATE users SET budget = budget + ? WHERE id = ?', [amount, userId]);

    // Enregistrer le renflouement dans la table refills
    await db.query(
      'INSERT INTO refills (user_id, amount, reason) VALUES (?, ?, ?)',
      [userId, amount, reason]
    );

    res.status(200).json({
      success: true,
      message: 'Fonds ajoutés avec succès.',
      data: { userId, amount, reason }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// 📋 Historique des renflouements
exports.getRefills = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.name AS user_name 
      FROM refills r 
      JOIN users u ON r.user_id = u.id 
      ORDER BY r.date DESC
    `);
    res.status(200).json({ success: true, refills: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
