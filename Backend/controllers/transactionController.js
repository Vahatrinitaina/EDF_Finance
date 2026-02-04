// controllers/transfersController.js
const db = require('../db'); // ta connexion SQL existante

// Fonction pour effectuer un transfert interne
const transfer = async (req, res) => {
    try {
        const { from_user_id, to_user_id, amount, description } = req.body;

        if (!from_user_id || !to_user_id || !amount) {
            return res.status(400).json({ success: false, message: "Paramètres manquants" });
        }

        // Vérifier que l'émetteur et le destinataire existent
        const sender = await db.get('SELECT * FROM users WHERE id = ?', [from_user_id]);
        const receiver = await db.get('SELECT * FROM users WHERE id = ?', [to_user_id]);

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "Utilisateur inexistant" });
        }

        // Vérifier le solde
        if (amount <= 0 || sender.solde < amount) {
            return res.status(400).json({ success: false, message: "Solde insuffisant ou montant invalide" });
        }

        // Début transaction SQL
        await db.run('BEGIN TRANSACTION');

        // Mettre à jour les soldes
        await db.run('UPDATE users SET solde = solde - ? WHERE id = ?', [amount, from_user_id]);
        await db.run('UPDATE users SET solde = solde + ? WHERE id = ?', [amount, to_user_id]);

        // Enregistrer la transaction
        const stmt = await db.run(
            'INSERT INTO transactions (type, montant, utilisateur_id, cible_id, date, description) VALUES (?, ?, ?, ?, ?, ?)',
            ['transfert', amount, from_user_id, to_user_id, new Date().toISOString(), description || '']
        );

        // Commit
        await db.run('COMMIT');

        return res.json({
            success: true,
            message: "Transfert effectué avec succès",
            transactionId: stmt.lastID,
            new_balance_sender: sender.solde - amount,
            new_balance_receiver: receiver.solde + amount
        });

    } catch (error) {
        await db.run('ROLLBACK');
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};

module.exports = { transfer };
