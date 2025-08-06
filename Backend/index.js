const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'edf_finance'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
    return;
  }
  console.log('Connexion à MySQL réussie');
});

// ➕ Nouvelle route pour récupérer les clients
app.get('/api/clients', (req, res) => {
  const sql = 'SELECT * FROM clients';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des clients :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(result);
  });
});

app.listen(5000, () => {
  console.log('Serveur démarré sur http://localhost:5000');
});
