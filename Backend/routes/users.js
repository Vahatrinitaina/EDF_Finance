const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateVerificationCode, getExpiryDate } = require('../utils/verification');
const sendEmail = require('../utils/sendEmail'); 


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    // Vérifie si email existe déjà
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Génère code vérification et expiry
    const verificationCode = generateVerificationCode();
    const verificationExpiry = getExpiryDate();

    // Insert utilisateur avec verified = 0
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, verified, verification_code, verification_expiry) 
       VALUES (?, ?, ?, 0, ?, ?)`,
      [name, email, hashedPassword, verificationCode, verificationExpiry]
    );

    // TODO : Envoie email avec verificationCode

    res.status(201).json({ message: 'Utilisateur créé. Veuillez vérifier votre email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

module.exports = router;


// GET /api/users — récupérer tous les utilisateurs
router.get('/', userController.getAllUsers);

// GET /api/users/:id — récupérer un utilisateur par ID
router.get('/:id', userController.getUserById);

// POST /api/users — créer un nouvel utilisateur
router.post('/', userController.createUser);

// PUT /api/users/:id — mettre à jour un utilisateur existant
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id — supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email et code sont obligatoires' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT verification_code, verification_expiry, verified FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = rows[0];

    if (user.verified) {
      return res.status(400).json({ error: 'Utilisateur déjà vérifié' });
    }

    const now = new Date();

    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Code incorrect' });
    }

    if (new Date(user.verification_expiry) < now) {
      return res.status(400).json({ error: 'Code expiré' });
    }

    // Met à jour la base pour verifier l'utilisateur
    await pool.query(
      'UPDATE users SET verified = 1, verification_code = NULL, verification_expiry = NULL WHERE email = ?',
      [email]
    );

    res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification' });
  }
});


module.exports = router;
