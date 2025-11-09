const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();
  } catch (err) {
    console.error('❌ Erreur de connexion à MySQL :', err.message);
    process.exit(1); // Stoppe le serveur si erreur critique
  }
}

testConnection();

module.exports = pool;
