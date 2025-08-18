const db = require('../config/db');

const User = {
  // Récupérer tous les utilisateurs
  getAll: (callback) => {
    const sql = 'SELECT id, name, email, role, created_at FROM users';
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Récupérer un utilisateur par ID
  getById: (id, callback) => {
    const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Récupérer un utilisateur par email
  getByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Créer un nouvel utilisateur
  create: (userData, callback) => {
    const { name, email, password, role, verification_code, verification_expiry } = userData;
    const sql = 'INSERT INTO users (name, email, password, role, verification_code, verification_expiry) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, password, role || 'user', verification_code || null, verification_expiry || null], (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...userData });
    });
  },

  // Mettre à jour un utilisateur
  update: (id, userData, callback) => {
    const { name, email, role } = userData;
    const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(sql, [name, email, role, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Supprimer un utilisateur
  delete: (id, callback) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Mettre à jour le code de réinitialisation et l'expiration
  setResetCode: (email, code, expiry, callback) => {
    const sql = 'UPDATE users SET verification_code = ?, verification_expiry = ? WHERE email = ?';
    db.query(sql, [code, expiry, email], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Mettre à jour le mot de passe et effacer le code de réinitialisation
  resetPassword: (id, hashedPassword, callback) => {
    const sql = 'UPDATE users SET password = ?, verification_code = NULL, verification_expiry = NULL WHERE id = ?';
    db.query(sql, [hashedPassword, id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
};

module.exports = User;
