const db = require('../config/db');

// Fonction pour effectuer un transfert entre utilisateurs
exports.transferMoney = async (req, res) => {
  const { senderId, recipientId, amount } = req.body;

  if (!senderId || !recipientId || !amount) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
  }

  try {
    // Vérifier que l’expéditeur est bien un directeur
    const [sender] = await db.query('SELECT * FROM users WHERE id = ?', [senderId]);
    if (sender.length === 0 || sender[0].role !== 'directeur') {
      return res.status(403).json({ success: false, message: 'Seuls les directeurs peuvent effectuer un transfert.' });
    }

    // Vérifier si l'expéditeur a suffisamment de fonds
    if (sender[0].budget < amount) {
      return res.status(400).json({ success: false, message: 'Fonds insuffisants.' });
    }

    // Vérifier si le destinataire existe
    const [recipient] = await db.query('SELECT * FROM users WHERE id = ?', [recipientId]);
    if (recipient.length === 0) {
      return res.status(404).json({ success: false, message: 'Destinataire non trouvé.' });
    }

    // Déduire l'argent du budget de l’expéditeur et ajouter au destinataire
    await db.query('UPDATE users SET budget = budget - ? WHERE id = ?', [amount, senderId]);
    await db.query('UPDATE users SET budget = budget + ? WHERE id = ?', [amount, recipientId]);

    // Enregistrer le transfert dans la table transfers
    await db.query(
      'INSERT INTO transfers (sender_id, recipient_id, amount) VALUES (?, ?, ?)',
      [senderId, recipientId, amount]
    );

    res.status(200).json({
      success: true,
      message: 'Transfert effectué avec succès.',
      data: { senderId, recipientId, amount }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du transfert.' });
  }
};

// Historique des transferts
exports.getTransfers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, s.name AS sender_name, r.name AS recipient_name 
      FROM transfers t
      JOIN users s ON t.sender_id = s.id
      JOIN users r ON t.recipient_id = r.id
      ORDER BY t.date DESC
    `);
    res.status(200).json({ success: true, transfers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des transferts.' });
  }
};
