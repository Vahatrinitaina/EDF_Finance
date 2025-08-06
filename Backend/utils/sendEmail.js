// sendEmail.js
const axios = require('axios');

const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const res = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'TonApp', email: 'no-reply@tonapp.com' },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      }
    );
    console.log('Email envoyé:', res.data);
    return true;
  } catch (error) {
    console.error('Erreur envoi mail:', error.response?.data || error.message);
    return false;
  }
};

module.exports = sendEmail;
