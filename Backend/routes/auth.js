const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController.js');
const { login } = require('../controllers/authController');
const { requestPasswordReset, resetPassword } = require('../controllers/authController.js');
const { verifyEmail } = require('../controllers/authController.js');


router.post('/verify-email', verifyEmail);

router.post('/login', login);

router.get('/verify', verifyEmail);

router.post('/register', registerUser);

router.post('/request-password-reset', requestPasswordReset);

router.post('/reset-password', resetPassword);



module.exports = router;
