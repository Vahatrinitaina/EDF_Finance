const db = require('../config/db'); // Connexion MySQL
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sendEmail = require('../utils/sendEmail'); 
const crypto = require('crypto');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Email déjà utilisé.' });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un code de vérification et une date d'expiration (ex: 1h)
    const verificationCode = crypto.randomBytes(3).toString('hex'); // ex: '4f3b2a'
    const verificationExpiry = new Date(Date.now() + 60 * 60 * 1000); // +1 heure

    // Insérer utilisateur avec code de vérification
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, verified, verification_code, verification_expiry) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 0, verificationCode, verificationExpiry]
    );

    // Préparer email de vérification
    const subject = 'Vérification de votre compte';
    const htmlContent = `
      <p>Bonjour ${name},</p>
      <p>Merci de vous être inscrit. Voici votre code de vérification : <b>${verificationCode}</b></p>
      <p>Ce code est valide pendant 1 heure.</p>
    `;

    // Envoyer email
    const emailSent = await sendEmail(email, subject, htmlContent);
    if (!emailSent) {
      return res.status(500).json({ message: 'Erreur lors de l\'envoi du mail de vérification.' });
    }

    res.status(201).json({ message: 'Compte créé. Veuillez vérifier votre email avec le code envoyé.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte.' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Identifiants invalides' });

    if (!user.is_verified)
      return res.status(403).json({ message: 'Email non vérifié' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Tous les champs sont requis' });

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email déjà utilisé' });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un code de vérification
    const verificationCode = uuidv4();
    const expiry = new Date(Date.now() + 3600 * 1000); // +1h

    // Insérer l'utilisateur
    await db.query(
      `INSERT INTO users (name, email, password, verification_code, verification_expiry) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, verificationCode, expiry]
    );

    // Envoyer l'email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Inscription réussie. Vérifiez votre email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: 'Email et code de vérification sont requis.' });
  }

  try {
    // Récupérer l'utilisateur avec son email
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND verification_code = ?',
      [email, verificationCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Code de vérification invalide ou email incorrect.' });
    }

    const user = rows[0];
    const now = new Date();

    // Vérifier expiration du code
    if (user.verification_expiry < now) {
      return res.status(400).json({ message: 'Le code de vérification a expiré.' });
    }

    // Mettre à jour l'utilisateur : validé, supprimer code et expiration
    await db.query(
      'UPDATE users SET verified = 1, verification_code = NULL, verification_expiry = NULL WHERE id = ?',
      [user.id]
    );

    res.status(200).json({ message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requis.' });

  try {
    // Vérifier si l'utilisateur existe
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Générer code + expiration (ex : 15 minutes)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min à partir de maintenant

    // Mettre à jour user avec code + expiry
    await db.query(
      'UPDATE users SET verification_code = ?, verification_expiry = ? WHERE email = ?',
      [resetCode, expiry, email]
    );

    // Envoi mail avec resetCode (fonction sendEmail déjà existante)
    const subject = 'Code de réinitialisation du mot de passe';
    const body = `Voici votre code de réinitialisation : ${resetCode}. Il est valable 15 minutes.`;

    await sendEmail(email, subject, body);

    res.status(200).json({ message: 'Code de réinitialisation envoyé par mail.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({ message: 'Email, code et nouveau mot de passe requis.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND verification_code = ?',
      [email, verificationCode]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Code invalide ou email incorrect.' });
    }

    const user = rows[0];
    const now = new Date();

    if (user.verification_expiry < now) {
      return res.status(400).json({ message: 'Le code a expiré.' });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour du mdp, suppression du code
    await db.query(
      'UPDATE users SET password = ?, verification_code = NULL, verification_expiry = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


