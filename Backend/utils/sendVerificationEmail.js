const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = 'no-reply@edf-finance.com'; // Adresse validée sur Brevo
const FROM_NAME = 'EDF Finance';

module.exports = async (toEmail, code) => {
  // Lien vers la page front React qui gérera la vérification
  const verificationLink = `http://localhost:3000/verify-email?email=${encodeURIComponent(toEmail)}&code=${code}`;

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: toEmail }],
        subject: 'Vérification de votre adresse email',
        htmlContent: `
          <p>Bonjour,</p>
          <p>Merci pour votre inscription. Cliquez sur le lien ci-dessous pour vérifier votre compte :</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>Ce lien expire dans 1 heure.</p>
        `,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Email de vérification envoyé à ${toEmail}`);
    return true; // Indique que l'envoi a réussi
  } catch (error) {
    console.error('Erreur envoi email:', error.response?.data || error.message);
    throw new Error('Échec d\'envoi d\'email');
  }
};
