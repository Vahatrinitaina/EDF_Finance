const User = require('../models/userModel');

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(users);
  });
};

// Récupérer un utilisateur par ID
exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.getById(id, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  });
};

// Créer un nouvel utilisateur
exports.createUser = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  User.create({ name, email, password, role }, (err, newUser) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
    res.status(201).json(newUser);
  });
};

// Mettre à jour un utilisateur
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email, role } = req.body;

  User.update(id, { name, email, role }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  });
};

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.delete(id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
};
