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

  // Créer un nouvel utilisateur
  create: (userData, callback) => {
    const { name, email, password, role } = userData;
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role], (err, results) => {
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
};

module.exports = User;
