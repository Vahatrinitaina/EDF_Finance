const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = 'votre@email.com'; // Modifier
const FROM_NAME = 'Nom du site';

module.exports = async (toEmail, code) => {
  const verificationLink = `https://votre-domaine.com/api/auth/verify?code=${code}`;

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: toEmail }],
      subject: 'Vérification de votre adresse email',
      htmlContent: `<p>Bonjour,</p>
                    <p>Merci pour votre inscription. Cliquez sur le lien ci-dessous pour vérifier votre compte :</p>
                    <p><a href="${verificationLink}">${verificationLink}</a></p>
                    <p>Ce lien expire dans 1 heure.</p>`
    }, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Erreur envoi email:", error.response?.data || error.message);
    throw new Error("Échec d'envoi d'email");
  }
};
