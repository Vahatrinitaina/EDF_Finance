function generateVerificationCode(length = 6) {
  const chars = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getExpiryDate(minutes = 15) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = { generateVerificationCode, getExpiryDate };
