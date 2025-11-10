const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const invoiceRoutes = require('./routes/invoices');
const categoryRoutes = require('./routes/categories');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');  // Nouvelle importation des routes clients
const authRoutes = require('./routes/auth'); // <-- ajout
const refillRoutes = require('./routes/refillRoutes');



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);  // Nouvelle route clients
app.use('/api/invoices', invoiceRoutes);// route factures
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/refill', refillRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
